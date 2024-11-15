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
    private static final double LOW_OUT_OF_SCREEN_THRESHOLD = 10.0;
    private static final double MODERATE_OUT_OF_SCREEN_THRESHOLD = 20.0;
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
        long outOfScreenCount = countOutOfScreenGaze(eyeTrackingDataList);

        double totalCount = eyeTrackingDataList.size();
        double textRatio = (textCount / totalCount) * 100;
        double imageRatio = (imageCount / totalCount) * 100;
        double outOfScreenRatio = (outOfScreenCount / totalCount) * 100;

        return determineGazeDistributionConclusion(textRatio, imageRatio, outOfScreenRatio);
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

    private long countOutOfScreenGaze(List<EyeTrackingData> dataList) {
        return dataList.stream()
                .filter(EyeTrackingData::getIsGazeOutOfScreen)
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
            return "아직 충분한 독서 데이터가 수집되지 않았습니다.";
        }

        // ANOVA 분석 수행
        OneWayAnova anova = new OneWayAnova();
        double pValue = anova.anovaPValue(groups);

        // 최적 시간대 결정
        Map.Entry<String, Double> bestTimeSlot = findBestTimeSlot(timeSlotData);

        return determineTimeBasedAttentionConclusion(pValue, bestTimeSlot.getKey(), bestTimeSlot.getValue() * 100);
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
    private String determineGazeDistributionConclusion(double textRatio, double imageRatio, double outOfScreenRatio) {
        StringBuilder conclusion = new StringBuilder();

        // 주요 시선 영역 파악
        if (Math.abs(textRatio - imageRatio) <= BALANCED_GAZE_THRESHOLD) {
            conclusion.append(String.format(
                    "텍스트 영역(%.1f%%)과 이미지 영역(%.1f%%)에 대한 시선 분포가 균형적이며, ",
                    textRatio, imageRatio
            ));
        } else if (textRatio > imageRatio) {
            conclusion.append(String.format(
                    "텍스트 영역(%.1f%%)에 이미지 영역(%.1f%%)보다 더 많은 시선이 분포하며, ",
                    textRatio, imageRatio
            ));
        } else {
            conclusion.append(String.format(
                    "이미지 영역(%.1f%%)에 텍스트 영역(%.1f%%)보다 더 많은 시선이 분포하며, ",
                    imageRatio, textRatio
            ));
        }

        // 화면 밖 응시 평가
        if (outOfScreenRatio <= LOW_OUT_OF_SCREEN_THRESHOLD) {
            conclusion.append(String.format("화면 밖 응시(%.1f%%)가 매우 적어 집중도가 높습니다.", outOfScreenRatio));
        } else if (outOfScreenRatio <= MODERATE_OUT_OF_SCREEN_THRESHOLD) {
            conclusion.append(String.format("화면 밖 응시(%.1f%%)가 적절한 수준입니다.", outOfScreenRatio));
        } else {
            conclusion.append(String.format("화면 밖 응시(%.1f%%)가 다소 높아 집중도 개선이 필요합니다.", outOfScreenRatio));
        }

        return conclusion.toString();
    }

    // 시간대별 집중도 결론 도출
    private static String determineTimeBasedAttentionConclusion(double pValue, String bestTimeSlot, double maxRate) {
        if (pValue < STATISTICAL_SIGNIFICANCE_THRESHOLD) {
            return String.format(
                    "%s 시간대에 가장 높은 집중도(%.1f%%)를 보입니다.",
                    bestTimeSlot, maxRate
            );
        } else {
            return String.format(
                    "%s 시간대의 집중도(%.1f%%)가 비교적 높지만, 시간대별 차이는 크지 않습니다.",
                    bestTimeSlot, maxRate
            );
        }
    }

    // 텍스트 길이 분석 결론 도출
    private static String determineTextLengthConclusion(SimpleRegression regression) {

        // R-squared가 너무 낮으면 신뢰할 수 없다고 판단
        if (regression.getRSquare() < MINIMUM_RELIABLE_R_SQUARED) {
            return "분석 결과의 신뢰도가 낮습니다.";
        }

        if (regression.getSignificance() >= STATISTICAL_SIGNIFICANCE_THRESHOLD) {
            return "글의 길이는 집중도에 유의미한 영향을 미치지 않습니다.";
        }

        return switch (Double.compare(regression.getSlope(), 0.0)) {
            case -1 -> "글이 길수록 집중력이 낮아지는 경향이 있습니다.";
            case 1 -> "글이 길수록 집중력이 높아지는 경향이 있습니다.";
            default -> "글의 길이와 관계없이 일정한 집중도를 유지합니다.";
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

                        위 분석 결과를 종합하여, 이 유아의 독서 패턴을 바탕으로 독서습관을 향상할 수 있는 솔루션을 2-3문장으로 간단히 요약해주세요.
                        전체적인 독서 성향과 가장 효과적인 독서 방법을 중심으로 작성해주세요.
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