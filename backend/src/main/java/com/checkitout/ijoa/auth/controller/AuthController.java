package com.checkitout.ijoa.auth.controller;

import com.checkitout.ijoa.auth.docs.AuthApiDocumentation;
import com.checkitout.ijoa.auth.service.AuthService;
import com.checkitout.ijoa.common.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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

        ResponseDto response = authService.setEmailVerificationCode(email);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
