package com.checkitout.ijoa.fairytale.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
public class FairytaleListResponseDto {

    @Schema(description = "동화책 Id", example = "1")
    private Long fairytaleId;

    @Schema(description = "동화책 제목", example = "노마의 우주 여행")
    private String title;

    @Schema(description = "동화책 표지 url", example = "https://checkitout-bucket.s3.amazonaws.com/images/9788929116910_표지.jpg")
    private String image;

    @Schema(description = "동화책 총 페이지 수", example = "14")
    private int totalPages;

    @Schema(description = "마지막으로 읽은 페이지", example = "0")
    private int currentPage;

    @Schema(description = "동화책 완독 여부", example = "false")
    @JsonProperty("isCompleted")
    private boolean isCompleted;


    @Builder
    public FairytaleListResponseDto(long fairytaleId, String title, String image, int total_pages, boolean is_completed,
                                    int current_page) {
        this.fairytaleId = fairytaleId;
        this.title = title;
        this.image = image;
        this.totalPages = total_pages;
        this.isCompleted = is_completed;
        this.currentPage = current_page;
    }
}
