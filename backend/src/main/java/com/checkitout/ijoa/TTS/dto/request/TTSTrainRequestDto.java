package com.checkitout.ijoa.TTS.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class TTSTrainRequestDto {

    @NotNull
    private List<FileScriptPair> fileScriptPairs;

    @Builder
    public TTSTrainRequestDto(List<FileScriptPair> fileScriptPairs) {
        this.fileScriptPairs = fileScriptPairs;
    }
}
