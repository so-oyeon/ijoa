package com.checkitout.ijoa.TTS.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FileScriptPair {

    @NotNull
    private String fileName;

    @NotNull
    private Long scriptId;

    @Builder
    public FileScriptPair(String fileName, Long scriptId) {
        this.fileName = fileName;
        this.scriptId = scriptId;
    }
}