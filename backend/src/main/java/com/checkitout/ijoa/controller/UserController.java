package com.checkitout.ijoa.controller;

import com.checkitout.ijoa.docs.UserApiDocumentation;
import com.checkitout.ijoa.dto.ResponseDto;
import com.checkitout.ijoa.dto.user.UserSignupRequestDto;
import com.checkitout.ijoa.service.user.UserService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController implements UserApiDocumentation {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ResponseDto> signUp(@Valid @RequestBody UserSignupRequestDto requestDto) {

        ResponseDto response = userService.signUp(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/check-email/{email}")
    public ResponseEntity<ResponseDto> checkEmailDuplication(
            @Parameter(description = "중복 확인할 이메일 주소", example = "email@email.com") @PathVariable String email) {

        ResponseDto response = userService.checkEmailDuplication(email);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
