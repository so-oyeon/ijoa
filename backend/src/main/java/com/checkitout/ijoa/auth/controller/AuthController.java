package com.checkitout.ijoa.auth.controller;

import com.checkitout.ijoa.auth.docs.AuthApiDocumentation;
import com.checkitout.ijoa.auth.dto.request.EmailVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.LoginRequestDto;
import com.checkitout.ijoa.auth.dto.request.PasswordVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.TokenReissueRequestDto;
import com.checkitout.ijoa.auth.dto.response.LoginResponseDto;
import com.checkitout.ijoa.auth.dto.response.TokenReissueResponseDto;
import com.checkitout.ijoa.auth.service.AuthService;
import com.checkitout.ijoa.common.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController implements AuthApiDocumentation {

    private final AuthService authService;

    @PostMapping("/email/verify-code/send")
    public ResponseEntity<ResponseDto> sendEmailVerificationCode(@RequestParam String email) {

        ResponseDto response = authService.sendEmailVerificationCode(email);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/email/verify-code/confirm")
    public ResponseEntity<ResponseDto> confirmEmailVerificationCode(
            @RequestBody EmailVerificationRequestDto requestDto) {

        ResponseDto response = authService.confirmEmailVerificationCode(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto) {

        LoginResponseDto response = authService.login(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenReissueResponseDto> reissueRefreshToken(@RequestBody TokenReissueRequestDto requestDto) {

        TokenReissueResponseDto response = authService.reissueRefreshToken(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/verify-password")
    public ResponseEntity<ResponseDto> verifyPassword(@RequestBody PasswordVerificationRequestDto requestDto) {

        ResponseDto response = authService.verifyPassword(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
