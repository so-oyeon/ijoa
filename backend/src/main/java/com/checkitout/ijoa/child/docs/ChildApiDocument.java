package com.checkitout.ijoa.child.docs;

import com.checkitout.ijoa.child.dto.response.ChildLevelResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Child", description = "자녀 관련 API")
public interface ChildApiDocument {

    @Operation(summary = "자녀 독서 레벨 조회", description = "자녀 독서 레벨을 조회합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "자녀 레벨 조회 성공", content = @Content(schema = @Schema(implementation = ChildLevelResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<ChildLevelResponseDto> getChildProfile();
}
