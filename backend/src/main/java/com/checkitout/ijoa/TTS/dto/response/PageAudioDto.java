package com.checkitout.ijoa.TTS.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class PageAudioDto {
    private String url;

    @Builder
    public PageAudioDto(String url) {
        this.url = url;
    }

    public static PageAudioDto from(String url){
        return PageAudioDto.builder().url(url).build();
    }
}
