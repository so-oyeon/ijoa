package com.checkitout.ijoa.TTS.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class StatusDto {
    private boolean status;

    @Builder
    public StatusDto(boolean status) {
        this.status = status;
    }

}
