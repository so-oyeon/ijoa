package com.checkitout.ijoa.TTS.dto.request;

import lombok.Data;

@Data
public class ErrorDto {
    private String errorMessage;
    private Long ttsId;
}
