package com.checkitout.ijoa.fairytale.dto;

import com.checkitout.ijoa.fairytale.domain.FairytalePage;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "동화책 페이지 정보 응답")
public class FairytalePageListResponse {

    @Schema(description = "페이지 번호", example = "1")
    private final Integer pageNumber;

    @Schema(description = "페이지 삽화 링크", example = "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20141001_272%2Fjh83com_1412142177092obzc7_JPEG%2FSAM_7159.JPG&type=a340")
    private final String image;

    public static FairytalePageListResponse from(FairytalePage fairytalePage) {
        return FairytalePageListResponse.builder()
                .pageNumber(fairytalePage.getPageNumber())
                .image(fairytalePage.getImageUrl())
                .build();
    }
}
