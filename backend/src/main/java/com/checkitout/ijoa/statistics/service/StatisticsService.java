package com.checkitout.ijoa.statistics.service;

import static com.checkitout.ijoa.exception.ErrorCode.INVALID_PERIOD;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.fairytale.repository.EyeTrackingDataRepository;
import com.checkitout.ijoa.statistics.dto.CategoryStatisticsResponse;
import com.checkitout.ijoa.statistics.dto.FocusTimeResponse;
import com.checkitout.ijoa.statistics.dto.TypographyResponse;
import com.checkitout.ijoa.statistics.util.StatisticsUtil;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import jakarta.persistence.Tuple;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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
    private final ChildReadBooksRepository childReadBooksRepository;
    private final SecurityUtil securityUtil;

    /**
     * 집중한 시간 그래프 조회
     */
    public List<FocusTimeResponse> getFocusTime(Long childId, String period, LocalDate startDate) {
        User user = securityUtil.getUserByToken();
        Child child = StatisticsUtil.getChildById(childRepository, childId);
        StatisticsUtil.validateChildAccess(user, child);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = getEndDateTime(startDate, period);

        String format = getDateFormat(period);

        // 해당 기간의 시선추적 데이터 조회
        List<Object[]> eyeTrackingDataList = eyeTrackingDataRepository
                .findAggregatedDataByChildAndDateRange(child, startDateTime, endDateTime, format);

        if (eyeTrackingDataList.isEmpty()) {
            return Collections.emptyList();
        }

        return generateFocusTimeResponses(eyeTrackingDataList, startDateTime, endDateTime, period);
    }

    /**
     * 집중한 단어 타이포그래피 조회
     */
    public List<TypographyResponse> getTypography(Long childId, Integer count) {
        User user = securityUtil.getUserByToken();
        Child child = StatisticsUtil.getChildById(childRepository, childId);
        StatisticsUtil.validateChildAccess(user, child);

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
        Child child = StatisticsUtil.getChildById(childRepository, childId);
        StatisticsUtil.validateChildAccess(user, child);

        List<Object[]> results = childReadBooksRepository.countByCategoryAndChild(child);

        return results.stream()
                .map(result -> CategoryStatisticsResponse.of((CATEGORY) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }


    // 기간에 따른 종료 시간 계산
    private LocalDateTime getEndDateTime(LocalDate startDate, String period) {
        return switch (period) {
            case "daily" -> startDate.plusDays(1).atStartOfDay();
            case "weekly" -> startDate.plusWeeks(1).atStartOfDay();
            case "monthly" -> startDate.plusMonths(1).withDayOfMonth(1).atStartOfDay();
            case "yearly" -> startDate.plusYears(1).atStartOfDay();
            default -> throw new CustomException(INVALID_PERIOD);
        };
    }

    // 데이터 처리
    private List<FocusTimeResponse> generateFocusTimeResponses(List<Object[]> dataList,
                                                               LocalDateTime start, LocalDateTime end, String period) {
        Map<String, Float> groupedData = initializeTimeSlots(start, end, period);

        // 데이터 그룹핑
        for (Object[] data : dataList) {
            String timeKey = formatTimeKey((String) data[0], period);
            Double avgAttentionRate = (Double) data[1];
            groupedData.put(timeKey, avgAttentionRate != null ? avgAttentionRate.floatValue() : null);
        }

        // 평균 계산 및 응답 생성
        return groupedData.entrySet().stream()
                .map(entry -> FocusTimeResponse.of(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private String getDateFormat(String period) {
        return switch (period) {
            case "daily" -> "%H";
            case "weekly" -> "%w";
            case "monthly" -> "%d";
            case "yearly" -> "%m";
            default -> throw new CustomException(INVALID_PERIOD);
        };
    }

    // 기간에 따른 슬롯 초기화
    private Map<String, Float> initializeTimeSlots(LocalDateTime start, LocalDateTime end, String period) {
        Map<String, Float> groupedData = new LinkedHashMap<>();

        LocalDateTime current = start;
        while (current.isBefore(end)) {
            groupedData.put(getTimeKey(current, period), null);
            current = switch (period) {
                case "daily" -> current.plusHours(1);
                case "weekly", "monthly" -> current.plusDays(1);
                case "yearly" -> current.plusMonths(1);
                default -> throw new CustomException(INVALID_PERIOD);
            };
        }

        return groupedData;
    }

    private String formatTimeKey(String dbKey, String period) {
        if ("weekly".equals(period)) {
            LocalDate date = LocalDate.now().with(DayOfWeek.of((Integer.parseInt(dbKey) % 7) + 1));
            return date.format(DateTimeFormatter.ofPattern("E", Locale.KOREAN));
        }
        return dbKey;
    }

    private String getTimeKey(LocalDateTime dateTime, String period) {
        return switch (period) {
            case "daily" -> String.format("%d", dateTime.getHour());
            case "weekly" -> dateTime.format(DateTimeFormatter.ofPattern("E", Locale.KOREAN));
            case "monthly" -> String.valueOf(dateTime.getDayOfMonth());
            case "yearly" -> String.valueOf(dateTime.getMonthValue());
            default -> throw new CustomException(INVALID_PERIOD);
        };
    }
}