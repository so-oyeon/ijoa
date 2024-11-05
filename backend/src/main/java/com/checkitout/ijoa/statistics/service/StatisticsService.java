package com.checkitout.ijoa.statistics.service;

import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_BELONG_TO_PARENT;
import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.INVALID_INTERVAL;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.fairytale.repository.EyeTrackingDataRepository;
import com.checkitout.ijoa.statistics.dto.CategoryStatisticsResponse;
import com.checkitout.ijoa.statistics.dto.FocusTimeResponse;
import com.checkitout.ijoa.statistics.dto.ReadingReportResponse;
import com.checkitout.ijoa.statistics.dto.TypographyResponse;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import jakarta.persistence.Tuple;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsService {
    private final ChildRepository childRepository;
    private final EyeTrackingDataRepository eyeTrackingDataRepository;
    private final ChildReadBooksRepository childReadBooksRepository;
    private final SecurityUtil securityUtil;

    /**
     * 집중한 시간 그래프 조회
     */
    public List<FocusTimeResponse> getFocusTime(Long childId, String interval) {
        User user = securityUtil.getUserByToken();
        Child child = getChildById(childId);
        validateChildAccess(user, child);

        List<EyeTrackingData> eyeTrackingDataList = eyeTrackingDataRepository.findTrackedDataByChild(child);

        if (eyeTrackingDataList.isEmpty()) {
            return Collections.emptyList();
        }

        return generateFocusTimeResponses(eyeTrackingDataList, interval);
    }

    public ReadingReportResponse getReadingReport(Long childId) {

        return ReadingReportResponse.test();
    }

    /**
     * 집중한 단어 타이포그래피 조회
     */
    public List<TypographyResponse> getTypography(Long childId, Integer count) {
        User user = securityUtil.getUserByToken();
        Child child = getChildById(childId);
        validateChildAccess(user, child);

        List<Tuple> wordFocusCount = eyeTrackingDataRepository.findWordFocusCount(child, count);

        return wordFocusCount.stream()
                .map(tuple -> TypographyResponse.of(tuple.get(0, String.class), tuple.get(1, Long.class)))
                .collect(Collectors.toList());
    }

    /**
     * 분류별 독서 통계 조회
     */
    public List<CategoryStatisticsResponse> getCategoryStatistics(Long childId) {
        User user = securityUtil.getUserByToken();
        Child child = getChildById(childId);
        validateChildAccess(user, child);

        List<Object[]> results = childReadBooksRepository.countByCategoryAndChild(child);

        return results.stream()
                .map(result -> CategoryStatisticsResponse.of((CATEGORY) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }


    // 아이 조회
    private Child getChildById(Long childId) {
        return childRepository.findById(childId).orElseThrow(() -> new CustomException(CHILD_NOT_FOUND));
    }

    // 아이 접근 권한 검증
    private void validateChildAccess(User user, Child child) {
        if (!Objects.equals(user.getId(), child.getParent().getId())) {
            throw new CustomException(CHILD_NOT_BELONG_TO_PARENT);
        }
    }

    // 시간 간격에 따른 집중도 데이터 처리 및 변환
    private List<FocusTimeResponse> generateFocusTimeResponses(List<EyeTrackingData> dataList, String interval) {
        Map<String, List<Float>> attentionRatesByUnit = new LinkedHashMap<>();
        getAllUnits(interval).forEach(unit -> attentionRatesByUnit.put(unit, new ArrayList<>()));

        for (EyeTrackingData data : dataList) {
            String unit = getUnit(data.getTrackedAt(), interval);
            float attentionRate = data.getIsGazeOutOfScreen() ? 0f : data.getAttentionRate();
            attentionRatesByUnit.get(unit).add(attentionRate);
        }

        return attentionRatesByUnit.entrySet().stream()
                .map(entry -> FocusTimeResponse.of(entry.getKey(), calculateAverage(entry.getValue())))
                .collect(Collectors.toList());
    }

    // 주어진 시간을 interval에 맞는 단위로 변환 (시간/요일/날짜)
    private String getUnit(LocalDateTime dateTime, String interval) {
        return switch (interval) {
            case "hour" -> String.format("%02d", dateTime.getHour());
            case "day" -> dateTime.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREAN);
            case "date" -> String.valueOf(dateTime.getDayOfMonth());
            default -> throw new CustomException(INVALID_INTERVAL);
        };
    }

    // interval에 따른 모든 단위값 목록 반환 (0-23시/월-일/1-31일)
    private List<String> getAllUnits(String interval) {
        return switch (interval) {
            case "hour" -> IntStream.range(0, 24)
                    .mapToObj(hour -> String.format("%02d", hour))
                    .collect(Collectors.toList());

            case "day" -> Arrays.stream(DayOfWeek.values())
                    .map(day -> day.getDisplayName(TextStyle.SHORT, Locale.KOREAN))
                    .collect(Collectors.toList());

            case "date" -> IntStream.rangeClosed(1, 31)
                    .mapToObj(String::valueOf)
                    .collect(Collectors.toList());

            default -> throw new CustomException(INVALID_INTERVAL);
        };
    }

    // 집중도 값들의 평균 계산
    private Float calculateAverage(List<Float> values) {
        return values.isEmpty() ? null :
                (float) values.stream()
                        .mapToDouble(Float::doubleValue)
                        .average()
                        .orElse(0.0) * 100;
    }
}