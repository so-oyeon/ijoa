package com.checkitout.ijoa.handler;

import com.checkitout.ijoa.dto.ErrorResponseDto;
import com.checkitout.ijoa.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseDto> handleValidationExceptions(MethodArgumentNotValidException e) {

        StringBuilder errorMessages = new StringBuilder();

        e.getBindingResult().getFieldErrors().forEach(fieldError ->
                errorMessages.append(fieldError.getDefaultMessage()).append(" ")
        );

        ResponseDto errorResponse = new ResponseDto(
                "BAD REQUEST",
                errorMessages.toString().trim()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto> handleGeneralException(Exception e) {

        ResponseDto errorResponseDto = new ResponseDto(
                "INTERNAL_SERVER_ERROR",
                e.getMessage()
        );

        return new ResponseEntity<>(errorResponseDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }


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
