package com.checkitout.ijoa.statistics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "독서 분석 보고서 응답")
public class ReadingReportResponse {

    @Schema(description = "분석 보고서", example = "- 긴 문장이 많거나 텍스트가 복잡한 경우 집중도가 떨어집니다. - 평균 7분을 넘기면 집중력 저하가 두드러집니다. - 짧고 흥미로운 문장을 읽을 때 집중력이 높으니, 5세 대상의 동화책을 추천합니다. 주로 오전 시간대에 집중력이 높으므로, 어려운 내용의 책은 오전에 읽도록 유도해 주세요.")
    private final String report;

    public static ReadingReportResponse test() {
        return ReadingReportResponse.builder()
                .report("- 긴 문장이 많거나 텍스트가 복잡한 경우 집중도가 떨어집니다. - 평균 7분을 넘기면 집중력 저하가 두드러집니다. - 짧고 흥미로운 문장을 읽을 때 집중력이 높으니, 5세 대상의 동화책을 추천합니다. 주로 오전 시간대에 집중력이 높으므로, 어려운 내용의 책은 오전에 읽도록 유도해 주세요.")
                .build();
    }
}
