package com.checkitout.ijoa.auth.docs;

import com.checkitout.ijoa.auth.dto.request.EmailVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.LoginRequestDto;
import com.checkitout.ijoa.auth.dto.request.PasswordVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.TokenReissueRequestDto;
import com.checkitout.ijoa.auth.dto.response.LoginResponseDto;
import com.checkitout.ijoa.auth.dto.response.TokenReissueResponseDto;
import com.checkitout.ijoa.common.dto.ResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Authentication", description = "인증 관련 API")
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


    @Operation(summary = "로그인", description = "로그인 합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "로그인 성공", content = @Content(schema = @Schema(implementation = LoginResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto);


    @Operation(summary = "토큰 재발급", description = "accessToken을 재발급합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "로그인 성공", content = @Content(schema = @Schema(implementation = TokenReissueResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<TokenReissueResponseDto> reissueRefreshToken(@RequestBody TokenReissueRequestDto requestDto);


    @Operation(summary = "비밀번호 검증", description = "비밀번호 일치여부를 확인합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "비밀번호가 일치합니다", content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/verify-password")
    public ResponseEntity<ResponseDto> verifyPassword(@RequestBody PasswordVerificationRequestDto requestDto);
}
