package com.checkitout.ijoa.TTS.dto.response;

import com.checkitout.ijoa.TTS.domain.TTS;
import lombok.Builder;
import lombok.Data;

@Data
public class ChildTTSListDto {
    private Long TTSId;
    private String TTSName;
    private String image;
    private Boolean audio_created;

    @Builder
    public ChildTTSListDto(Long TTSId, String TTSName, String image, Boolean audio_created) {
        this.TTSId = TTSId;
        this.TTSName = TTSName;
        this.image = image;
        this.audio_created = audio_created;
    }

    public static ChildTTSListDto from(TTS tts, Boolean audio_created) {
        return ChildTTSListDto.builder()
                .TTSId(tts.getId())
                .TTSName(tts.getName())
                .image(tts.getImage())
                .audio_created(audio_created)
                .build();
    }

}
