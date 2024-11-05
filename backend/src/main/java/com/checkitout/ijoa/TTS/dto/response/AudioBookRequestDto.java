package com.checkitout.ijoa.TTS.dto.response;

import com.checkitout.ijoa.fairytale.dto.response.FairytalePageResponseDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AudioBookRequestDto {
    @JsonProperty("book_id")
    private Long bookId;
    @JsonProperty("tts_id")
    private Long ttsId;
    @JsonProperty("model_path")
    private String modelPath;
    @JsonProperty("pages")
    private List<FairytalePageResponseDto> pages;

    @Builder
    public AudioBookRequestDto(Long bookId, Long ttsId, String modelPath, List<FairytalePageResponseDto> pages) {
        this.bookId = bookId;
        this.ttsId = ttsId;
        this.modelPath = modelPath;
        this.pages = pages;
    }
}
