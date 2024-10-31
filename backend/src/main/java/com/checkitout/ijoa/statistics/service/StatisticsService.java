package com.checkitout.ijoa.statistics.service;

import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.statistics.dto.CategoryStatisticsResponse;
import com.checkitout.ijoa.statistics.dto.FocusTimeResponse;
import com.checkitout.ijoa.statistics.dto.ReadingReportResponse;
import com.checkitout.ijoa.statistics.dto.TypographyResponse;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    public List<FocusTimeResponse> getFocusTime(Long childId, String period, LocalDate startDate) {

        List<FocusTimeResponse> data = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            data.add(FocusTimeResponse.test(startDate.plusDays(i).toString()));
        }

        return data;
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

}