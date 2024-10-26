package com.checkitout.ijoa.auth.docs;

import com.checkitout.ijoa.auth.dto.EmailVerificationRequestDto;
import com.checkitout.ijoa.common.dto.ResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public interface AuthApiDocumentation {


    @Operation(summary = "이메일 인증코드 전송", description = "이메일 인증코드를 전송합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "인증코드 전송 성공 ", content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/email/verify-code/send")
    public ResponseEntity<ResponseDto> sendEmailVerificationCode(@RequestParam String email);


    @Operation(summary = "이메일 인증코드 검증", description = "이메일 인증코드를 검증합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "이메일 검증 성공", content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/email/verify-code/confirm")
    public ResponseEntity<ResponseDto> confirmEmailVerificationCode(
            @RequestBody EmailVerificationRequestDto requestDto);
}
