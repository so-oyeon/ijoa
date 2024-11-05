package com.checkitout.ijoa.fairytale.dto;

import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.domain.PageHistory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "동화책 페이지 상세 정보 응답")
public class FairytalePageViewResponse {

    @Schema(description = "페이지 번호", example = "1")
    private final Integer pageNumber;

    @Schema(description = "내용", example = "노마가 로켓을 타고 슈웅! 은하수에서 헤엄치는 펭귄들을 보았어요. \"바보 펭귄들아! 너희들 여기 있었구나\" 노마가 웃으며 손을 흔들었어요.")
    private final String content;

    @Schema(description = "삽화 이미지 링크", example = "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20141001_272%2Fjh83com_1412142177092obzc7_JPEG%2FSAM_7159.JPG&type=a340")
    private final String image;

    @Schema(description = "총 페이지 개수", example = "20")
    private final Integer totalPages;

    @Schema(description = "페이지 기록 ID", example = "1")
    private final Long pageHistoryId;

    public static FairytalePageViewResponse of(FairytalePageContent fairytalePageContent, PageHistory pageHistory) {
        return FairytalePageViewResponse.builder()
                .pageNumber(fairytalePageContent.getPageNumber())
                .content(fairytalePageContent.getContent())
                .image(fairytalePageContent.getFairytalePageImage().getImageUrl())
                .totalPages(fairytalePageContent.getFairytale().getTotalPages())
                .pageHistoryId(pageHistory.getId())
                .build();
    }
}
