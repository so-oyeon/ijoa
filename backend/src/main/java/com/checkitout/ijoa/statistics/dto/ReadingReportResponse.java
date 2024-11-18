package com.checkitout.ijoa.statistics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "독서 분석 보고서 응답")
public class ReadingReportResponse {

    @Schema(description = "시선 분포 분석 결과", example = "텍스트 영역(60.0%)에 이미지 영역(30.0%)보다 더 많은 시선이 분포하며, 화면 밖 응시(10.0%)가 매우 적어 집중도가 높습니다.")
    private String gazeDistributionAnalysis;

    @Schema(description = "독서 시간대별 집중도 분석 결과", example = "아침 시간대의 집중도(70.0%)가 비교적 높지만, 시간대별 차이는 크지 않습니다.")
    private String timeOfDayAttentionAnalysis;

    @Schema(description = "텍스트 길이와 집중도 간의 관계 분석 결과", example = "글이 길수록 집중력이 낮아지는 경향이 있습니다.")
    private String textLengthAnalysis;

    @Schema(description = "분석 최종 결론", example = "김다솔 어린이는 텍스트 영역에 집중하는 경향이 강하지만 긴 글에서는 집중력이 저하될 수 있습니다. 따라서 상대적으로 짧은 글로 구성된 아침 시간대의 독서 활동을 통해 집중력을 최대화할 수 있도록 도와주는 것이 좋습니다. 또한, 이미지와 텍스트가 균형 잡힌 도서를 선택하여 시각적 흥미를 유지하는 것도 효과적인 방법입니다.")
    private final String conclusion;

    public static ReadingReportResponse of(String gazeDistributionAnalysis, String timeOfDayAttentionAnalysis,
                                           String textLengthAnalysis, String conclusion) {
        return ReadingReportResponse.builder()
                .gazeDistributionAnalysis(gazeDistributionAnalysis)
                .timeOfDayAttentionAnalysis(timeOfDayAttentionAnalysis)
                .textLengthAnalysis(textLengthAnalysis)
                .conclusion(conclusion)
                .build();
    }
}