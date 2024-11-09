package com.checkitout.ijoa.TTS.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class AudioPathDto {
    private Long ttsId;
    private Long bookId;
    private List<Map<String, String>> audioPath;
}
