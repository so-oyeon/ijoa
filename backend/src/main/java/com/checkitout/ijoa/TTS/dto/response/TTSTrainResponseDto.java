package com.checkitout.ijoa.TTS.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class TTSTrainResponseDto {
    private String key;
    private String url;

    @Builder
    public TTSTrainResponseDto(String key, String url) {
        this.key = key;
        this.url = url;
    }
}
