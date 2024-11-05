package com.checkitout.ijoa.statistics.service;

import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_BELONG_TO_PARENT;
import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.INVALID_PERIOD;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import com.checkitout.ijoa.fairytale.repository.EyeTrackingDataRepository;
import com.checkitout.ijoa.statistics.dto.CategoryStatisticsResponse;
import com.checkitout.ijoa.statistics.dto.FocusTimeResponse;
import com.checkitout.ijoa.statistics.dto.ReadingReportResponse;
import com.checkitout.ijoa.statistics.dto.TypographyResponse;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsService {
    private final ChildRepository childRepository;
    private final EyeTrackingDataRepository eyeTrackingDataRepository;
    private final SecurityUtil securityUtil;

    /**
     * 집중한 시간 그래프 조회
     */
    public List<FocusTimeResponse> getFocusTime(Long childId, String period, LocalDate startDate) {
        User user = securityUtil.getUserByToken();

        Child child = getChildById(childId);

        validateChildAccess(user, child);

        LocalDateTime startDateTime = startDate.atStartOfDay();

        LocalDateTime endDateTime = getEndDateTime(startDate, period);

        // 해당 기간의 시선추적 데이터 조회
        List<EyeTrackingData> eyeTrackingDataList = eyeTrackingDataRepository
                .findTrackedDataByChildAndDateRange(child, startDateTime, endDateTime);

        if (eyeTrackingDataList.isEmpty()) {
            return Collections.emptyList();
        }

        return generateFocusTimeResponses(eyeTrackingDataList, startDateTime, endDateTime, period);
    }

    public ReadingReportResponse getReadingReport(Long childId) {

        return ReadingReportResponse.test();
    }

    public List<TypographyResponse> getTypography(Long childId, Integer count) {

        List<TypographyResponse> data = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            data.add(TypographyResponse.test("사과" + i, count - i));
        }

        return data;
    }

    public List<CategoryStatisticsResponse> getCategoryStatistics(Long childId) {

        List<CategoryStatisticsResponse> data = new ArrayList<>();

        int count = 10;
        for (CATEGORY category : CATEGORY.values()) {
            data.add(CategoryStatisticsResponse.test(category.getDisplayName(), count--));
        }

        return data;
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

    // 기간에 따른 종료 시간 계산
    private LocalDateTime getEndDateTime(LocalDate startDate, String period) {
        return switch (period) {
            case "daily" -> startDate.plusDays(1).atStartOfDay();
            case "weekly" -> startDate.plusWeeks(1).atStartOfDay();
            case "monthly" -> startDate.plusMonths(1).atStartOfDay();
            default -> throw new CustomException(INVALID_PERIOD);
        };
    }

    // 데이터 처리
    private List<FocusTimeResponse> generateFocusTimeResponses(List<EyeTrackingData> dataList,
                                                               LocalDateTime start, LocalDateTime end, String period) {
        Map<String, List<Float>> groupedData = initializeTimeSlots(start, end, period);

        // 데이터 그룹핑
        for (EyeTrackingData data : dataList) {
            String timeKey = getTimeKey(data.getTrackedAt(), period);
            float attentionRate = data.getIsGazeOutOfScreen() ? 0f : data.getAttentionRate();
            groupedData.get(timeKey).add(attentionRate);
        }

        // 평균 계산 및 응답 생성
        return groupedData.entrySet().stream()
                .map(entry -> FocusTimeResponse.of(entry.getKey(), calculateAverage(entry.getValue())))
                .collect(Collectors.toList());
    }

    // 기간에 따른 슬롯 초기화
    private Map<String, List<Float>> initializeTimeSlots(LocalDateTime start, LocalDateTime end, String period) {
        Map<String, List<Float>> groupedData = new TreeMap<>();

        LocalDateTime current = start;
        while (current.isBefore(end)) {
            groupedData.put(getTimeKey(current, period), new ArrayList<>());
            current = switch (period) {
                case "daily" -> current.plusHours(1);
                case "weekly", "monthly" -> current.plusDays(1);
                default -> throw new CustomException(INVALID_PERIOD);
            };
        }

        return groupedData;
    }

    private String getTimeKey(LocalDateTime dateTime, String period) {
        return switch (period) {
            case "daily" -> String.format("%02d:00", dateTime.getHour());
            case "weekly", "monthly" -> dateTime.toLocalDate().toString();
            default -> throw new CustomException(INVALID_PERIOD);
        };
    }

    // 평균 집중도 계산
    private Float calculateAverage(List<Float> values) {
        return values.isEmpty() ? null :
                (float) values.stream()
                        .mapToDouble(Float::doubleValue)
                        .average()
                        .orElse(0.0);
    }
}