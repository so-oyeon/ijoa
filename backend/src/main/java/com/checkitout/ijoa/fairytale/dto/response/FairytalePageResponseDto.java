package com.checkitout.ijoa.fairytale.dto.response;

import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import lombok.Builder;
import lombok.Data;

@Data
public class FairytalePageResponseDto {
    private Long pageId;
    private String text;

    @Builder
    public FairytalePageResponseDto(Long pageId, String text) {
        this.pageId = pageId;
        this.text = text;
    }

    public static FairytalePageResponseDto from (FairytalePageContent content){
        return FairytalePageResponseDto.builder()
                .pageId(content.getId())
                .text(content.getContent())
                .build();
    }
}
