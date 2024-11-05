package com.checkitout.ijoa.TTS.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class TrainAudioResponseDto {
    @JsonProperty("tts_id")
    private Long ttsId;
    @JsonProperty("path")
    private List<String> path;
    @JsonProperty("script")
    private List<String> script;

    @Builder
    public TrainAudioResponseDto(Long ttsId, List<String> path, List<String> script) {
        this.path = path;
        this.script = script;
        this.ttsId = ttsId;
    }

    public static TrainAudioResponseDto from(Long ttsId, List<String> path, List<String> script) {
        return TrainAudioResponseDto.builder()
                .ttsId(ttsId)
                .path(path)
                .script(script)
                .build();
    }
}
