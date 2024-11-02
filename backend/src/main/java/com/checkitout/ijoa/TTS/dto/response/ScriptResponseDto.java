package com.checkitout.ijoa.TTS.dto.response;

import com.checkitout.ijoa.TTS.domain.Script;
import lombok.Builder;
import lombok.Data;

@Data
public class ScriptResponseDto {
    private Long id;
    private String script;

    @Builder
    public ScriptResponseDto(Long id, String script) {
        this.script = script;
        this.id = id;
    }

    public static ScriptResponseDto from(Script script) {
        return ScriptResponseDto.builder()
                .id(script.getId())
                .script(script.getScript())
                .build();
    }
}
