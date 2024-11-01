package com.checkitout.ijoa.user.docs;

import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.user.dto.UserDto;
import com.checkitout.ijoa.user.dto.UserSignupRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "User", description = "사용자 관련 API")
public interface UserApiDocumentation {

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "회원 가입 성공", content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<ResponseDto> signUp(@Valid @RequestBody UserSignupRequestDto requestDto);


    @Operation(summary = "이메일 중복 확인", description = "회원가입시 이메일 중복 검사")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "중복된 이메일이 없습니다 ", content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<ResponseDto> checkEmailDuplication(
            @Parameter(description = "중복 확인할 이메일 주소", example = "email@email.com") @PathVariable String email);


    @Operation(summary = "회원 정보 조회", description = "사용자의 상세 정보 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원 정보 조회 성공 ", content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<UserDto> getUser();
}
