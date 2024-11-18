package com.checkitout.ijoa.TTS.dto.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class temp {
    private Long bookId;
    private Long ttsId;
    private List<Map<String, String>> s3Keys;
}
