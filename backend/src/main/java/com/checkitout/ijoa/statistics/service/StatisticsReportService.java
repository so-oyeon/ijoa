package com.checkitout.ijoa.statistics.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import com.checkitout.ijoa.fairytale.repository.EyeTrackingDataRepository;
import com.checkitout.ijoa.quiz.dto.Message;
import com.checkitout.ijoa.quiz.dto.request.ChatGPTRequest;
import com.checkitout.ijoa.quiz.dto.request.ChatGPTResponse;
import com.checkitout.ijoa.statistics.dto.ReadingReportResponse;
import com.checkitout.ijoa.statistics.util.StatisticsUtil;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.commons.math3.stat.inference.OneWayAnova;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsReportService {
    private final ChildRepository childRepository;
    private final EyeTrackingDataRepository eyeTrackingDataRepository;
    private final SecurityUtil securityUtil;
    private final RestTemplate template;

    private static final double BALANCED_GAZE_THRESHOLD = 5.0;
    private static final double STATISTICAL_SIGNIFICANCE_THRESHOLD = 0.05;
    private static final double MINIMUM_RELIABLE_R_SQUARED = 0.2;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURL;

    /**
     * 독서 분석 보고서 조회
     */
    public ReadingReportResponse getReadingReport(Long childId) {
        User user = securityUtil.getUserByToken();
        Child child = StatisticsUtil.getChildById(childRepository, childId);
        StatisticsUtil.validateChildAccess(user, child);

        List<EyeTrackingData> eyeTrackingDataList = eyeTrackingDataRepository.findByPageHistory_Child(child);

        if (eyeTrackingDataList.isEmpty()) {
            return null;
        }

        String gazeAnalysis = analyzeGazeDistribution(eyeTrackingDataList);
        String timeAnalysis = analyzeAttentionByTimeOfDay(eyeTrackingDataList);
        String textLengthAnalysis = analyzeImpactOfTextLengthOnAttention(eyeTrackingDataList);
        String conclusion = generateConciseConclusion(child, gazeAnalysis, timeAnalysis, textLengthAnalysis);

        return ReadingReportResponse.of(gazeAnalysis, timeAnalysis, textLengthAnalysis, conclusion);
    }


    /**
     * 시선 분포 분석
     */
    public String analyzeGazeDistribution(List<EyeTrackingData> eyeTrackingDataList) {

        // 시선 위치에 따른 분류 및 비율 계산
        long textCount = countTextAreaGaze(eyeTrackingDataList);
        long imageCount = countImageAreaGaze(eyeTrackingDataList);

        double totalCount = eyeTrackingDataList.size();
        double textRatio = (textCount / totalCount) * 100;
        double imageRatio = (imageCount / totalCount) * 100;

        return determineGazeDistributionConclusion(textRatio, imageRatio);
    }

    // 시선 위치 카운팅 메서드들
    private long countTextAreaGaze(List<EyeTrackingData> dataList) {
        return dataList.stream()
                .filter(data -> !data.getIsImage() && !data.getIsGazeOutOfScreen())
                .count();
    }

    private long countImageAreaGaze(List<EyeTrackingData> dataList) {
        return dataList.stream()
                .filter(data -> data.getIsImage() && !data.getIsGazeOutOfScreen())
                .count();
    }


    /**
     * 시간대별 집중도 분석 (ANOVA)
     */
    public String analyzeAttentionByTimeOfDay(List<EyeTrackingData> eyeTrackingDataList) {
        Map<String, List<Float>> timeSlotData = groupDataByTimeSlot(eyeTrackingDataList);

        List<double[]> groups = timeSlotData.values().stream()
                .filter(list -> list != null && !list.isEmpty())
                .map(list -> list.stream().filter(Objects::nonNull).mapToDouble(d -> d).toArray())
                .filter(array -> array.length >= 2)
                .toList();

        if (groups.size() < 2) {
            return "아직 책을 읽은 시간이 다양하지 않아요. 여러 시간대에 책을 읽으면 더 유용한 분석을 할 수 있을 거예요!";
        }

        // ANOVA 분석 수행
        OneWayAnova anova = new OneWayAnova();
        double pValue = anova.anovaPValue(groups);

        // 최적 시간대 결정
        Map.Entry<String, Double> bestTimeSlot = findBestTimeSlot(timeSlotData);

        return determineTimeBasedAttentionConclusion(pValue, bestTimeSlot.getKey());
    }

    private Map<String, List<Float>> groupDataByTimeSlot(List<EyeTrackingData> dataList) {
        return dataList.stream()
                .collect(Collectors.groupingBy(
                        data -> determineTimeSlot(data.getTrackedAt()),
                        Collectors.mapping(
                                EyeTrackingData::getAttentionRate,
                                Collectors.toList()
                        )
                ));
    }

    private String determineTimeSlot(LocalDateTime dateTime) {
        int hour = dateTime.getHour();
        if (hour >= 6 && hour <= 11) {
            return "아침";
        }
        if (hour >= 12 && hour <= 17) {
            return "오후";
        }
        if (hour >= 18) {
            return "저녁";
        }
        return "밤";
    }

    private Map.Entry<String, Double> findBestTimeSlot(Map<String, List<Float>> timeSlotData) {
        return timeSlotData.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .mapToDouble(d -> d)
                                .average()
                                .orElse(0.0)
                ))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(Map.entry("아침", 0.0));
    }


    /**
     * 텍스트 길이와 집중도 간의 회귀 분석
     */
    public String analyzeImpactOfTextLengthOnAttention(List<EyeTrackingData> eyeTrackingDataList) {
        SimpleRegression regression = new SimpleRegression();

        eyeTrackingDataList.forEach(data -> regression.addData(
                data.getPageHistory().getPageContent().getContent().length(),
                (data.getAttentionRate() == null || data.getIsGazeOutOfScreen()) ? 0.0 : data.getAttentionRate()
        ));

        return determineTextLengthConclusion(regression);
    }

    /**
     * 결론
     */
    // 시선 분포 결론 도출
    private String determineGazeDistributionConclusion(double textRatio, double imageRatio) {
        StringBuilder conclusion = new StringBuilder();

        // 주요 시선 영역 파악
        if (Math.abs(textRatio - imageRatio) <= BALANCED_GAZE_THRESHOLD) {
            conclusion.append("그림도 재미있고 글씨도 재미있었어요! 둘 다 열심히 보면서 이야기를 즐겼어요!");
        } else if (textRatio > imageRatio) {
            conclusion.append("저는 글씨가 더 재미있었어요! 그림도 예뻤지만, 글 속 이야기에 더 푹 빠졌어요!");
        } else {
            conclusion.append("저는 그림이 더 재미있어요! 글씨는 조금 어려워서 그림을 더 오래 보고 있었나 봐요!");
        }

        return conclusion.toString();
    }

    // 시간대별 집중도 결론 도출
    private static String determineTimeBasedAttentionConclusion(double pValue, String bestTimeSlot) {
        if (pValue < STATISTICAL_SIGNIFICANCE_THRESHOLD) {
            return String.format(
                    "%s에 제일 잘 집중해요! 눈도 반짝반짝, 마음도 준비 완료였어요!",
                    bestTimeSlot
            );
        } else {
            return String.format(
                    "%s에 집중력이 조금 더 빛났지만, 모든 시간에 책을 즐겁게 봤어요!",
                    bestTimeSlot
            );
        }
    }

    // 텍스트 길이 분석 결론 도출
    private static String determineTextLengthConclusion(SimpleRegression regression) {

        // R-squared가 너무 낮으면 신뢰할 수 없다고 판단
        if (regression.getRSquare() < MINIMUM_RELIABLE_R_SQUARED) {
            return "아직 결과가 조금 부족해요. 책을 더 많이 읽으면 더 도움되는 분석을 할 수 있을 거예요!";
        }

        if (regression.getSignificance() >= STATISTICAL_SIGNIFICANCE_THRESHOLD) {
            return "글이 길어도 짧아도 똑같이 열심히 보고 있었어요! 글의 길이는 크게 상관없어요!";
        }

        return switch (Double.compare(regression.getSlope(), 0.0)) {
            case -1 -> "글이 길어지면 조금씩 쉬고 싶어 했던 것 같아요. 아직은 짧고 간단한 게 더 편안한가 봐요!";
            case 1 -> "글이 길어질수록 점점 더 재미있어져서 계속 보고 싶어요!";
            default -> "글이 길어도 짧아도 괜찮아요! 저는 이야기가 너무 좋아요!";
        };
    }


    /**
     * 종합 분석 및 권장사항 생성
     */
    private String generateConciseConclusion(Child child, String gazeDistribution, String timeBasedAttention,
                                             String textLengthImpact) {

        String prompt = String.format(
                """
                        다음은 %s(%s, %s)의 독서 행동 분석 결과입니다:

                        1. 시선 분포: %s
                        2. 시간대별 집중도: %s
                        3. 텍스트 길이 영향: %s

                        이 아이의 독서 패턴을 바탕으로, 더 재미있고 효과적으로 책을 읽을 수 있는 방법을 2-3문장으로 제안해 주세요.
                        아이가 책을 더 즐기고 배울 수 있도록, 따뜻하고 긍정적인 말로 조언을 부탁드려요!
                        """,
                child.getName(), child.getBirth(), child.getGender(),
                gazeDistribution,
                timeBasedAttention,
                textLengthImpact
        );

        ChatGPTRequest request = new ChatGPTRequest(model, prompt);

        request.getMessages().add(0, new Message("system", "아이의 독서 행동을 분석하고 맞춤형 가이드를 제시하는 전문가입니다."));

        ChatGPTResponse response = template.postForObject(
                apiURL,
                request,
                ChatGPTResponse.class
        );

        if (response != null) {
            return response.getChoices().get(0).getMessage().getContent();
        }

        return "독서 권장사항을 생성하는 중 오류가 발생했습니다.";
    }
}