package com.checkitout.ijoa.child.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ChildLevelResponseDto {

    @Schema(description = "총 읽은책 수", example = "4")
    long totalCount;

    @Schema(description = "레벨", example = "2")
    int level;

    public static ChildLevelResponseDto of(long totalCount, int level) {
        ChildLevelResponseDto dto = new ChildLevelResponseDto();
        dto.level = level;
        dto.totalCount = totalCount;
        return dto;
    }
}
