package com.checkitout.ijoa.TTS.dto.response;

import com.checkitout.ijoa.TTS.domain.TTS;
import lombok.Builder;
import lombok.Data;

@Data
public class TTSProfileResponseDto {
    private Long id;
    private String name;
    private String tts;
    private String image;

    @Builder
    public TTSProfileResponseDto(Long id, String name, String tts, String image) {
        this.id = id;
        this.name = name;
        this.tts = tts;
        this.image = image;
    }

    public static TTSProfileResponseDto fromTTS(TTS tts){
        return TTSProfileResponseDto.builder()
                .id(tts.getId())
                .name(tts.getName())
                .tts(tts.getTTS())
                .image(tts.getImage())
                .build();
    }
}
