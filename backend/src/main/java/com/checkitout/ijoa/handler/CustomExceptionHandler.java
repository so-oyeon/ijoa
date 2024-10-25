package com.checkitout.ijoa.handler;

import com.checkitout.ijoa.dto.ErrorResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponseDto> handleCustomException(CustomException e) {
        return buildErrorResponse(e, e.getCode(), e.getMessage(), e.getHttpStatus());
    }

    private ResponseEntity<ErrorResponseDto> buildErrorResponse(Exception e, String code, String message,
                                                                HttpStatus status) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto();
        errorResponseDto.setCode(code);
        errorResponseDto.setMessage(message);
        return new ResponseEntity<>(errorResponseDto, status);
    }
}
