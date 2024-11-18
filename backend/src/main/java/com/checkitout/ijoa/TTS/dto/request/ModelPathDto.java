package com.checkitout.ijoa.TTS.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ModelPathDto {
    private String modelPath;
    private Long ttsId;
}
