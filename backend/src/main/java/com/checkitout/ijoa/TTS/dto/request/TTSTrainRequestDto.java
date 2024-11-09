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
    @Schema(description = "TTS학습 데이터 ", example = "[{'audio1.wav',1 },{'audio2.wav',2 },{'audio3.wav',3 },{'audio4.wav',4 },{'audio5.wav',5 }," +
            "{'audio6.wav',6 },{'audio6.wav',6 },{'audio7.wav',7 },{'audio8.wav',8 },{'audio9.wav',9 },{'audio10.wav',10 },{'audio11.wav',11 }," +
            "{'audio12.wav',12 },{'audio13.wav',13 },{'audio14.wav',14 },{'audio15.wav',15 },{'audio16.wav',16 },{'audio17.wav',17 },{'audio18.wav',18 }," +
            "{'audio19.wav',19 },{'audio20.wav',20 },{'audio21.wav',21 },]")
    private List<FileScriptPair> fileScriptPairs;

    @Builder
    public TTSTrainRequestDto(List<FileScriptPair> fileScriptPairs) {
        this.fileScriptPairs = fileScriptPairs;
    }
}
