package com.checkitout.ijoa.TTS.docs;

import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileUpdateRequestDto;
import com.checkitout.ijoa.TTS.dto.request.TTSTrainRequestDto;
import com.checkitout.ijoa.TTS.dto.response.TTSProfileResponseDto;
import com.checkitout.ijoa.TTS.dto.response.temp;
import com.checkitout.ijoa.child.dto.request.CreateChildRequestDto;
import com.checkitout.ijoa.child.dto.request.UpdateChildRequestDto;
import com.checkitout.ijoa.child.dto.response.ChildDto;
import com.checkitout.ijoa.common.dto.ResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;

@Tag(name = "TTS", description = "TTS 관련 API")
public interface TTSApiDocumentation {

    @Operation(summary = "TTS 프로필 생성", description = "새로운 TTS를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "TTS 등록 성공", content = @Content(schema = @Schema(implementation = TTSProfileResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> createTTSProfile(
            @Valid @RequestBody TTSProfileRequestDto requestDto) throws IOException;

    @Operation(summary = "TTS 프로필 삭제", description = "TTS 프로필을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "TTS 삭제 성공", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> deleteTTSProfile(@PathVariable Long ttsId) throws IOException;

    @Operation(summary = "TTS 프로필 수정", description = "TTS 프로필을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "TTS 수정 성공", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> updateTTSProfile(@PathVariable Long ttsId, @RequestBody TTSProfileUpdateRequestDto requestDto) throws IOException;


    @Operation(summary = "TTS 목록 조회(부모페이지)", description = "부모가 자신이 생성한 TTS 목록을 조회할 수 있습니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "TTS 목록 조회 성공", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> ParentTTSList() throws IOException;

    @Operation(summary = "TTS script 목록 조회", description = "TTS 녹음 시 사용할 스크립트 목록")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "script 목록 조회 성공", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> getScriptList() throws IOException;

    @Operation(summary = "TTS 학습용 음성 파일 저장", description = "TTS 생성 시 녹음한 음성 파일을 저장할 수 있는 presigned url을 반환합니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "저장 성공", content = @Content(schema = @Schema(implementation = TTSProfileResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> saveTrainData(
            @PathVariable Long ttsId,
            @Valid @RequestBody TTSTrainRequestDto requestDto) throws IOException;

    @Operation(summary = "동화책 TTS 음성 파일 생성", description = "TTS로 동화책 오디오 파일을 생성합니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "생성 성공", content = @Content(schema = @Schema(implementation = TTSProfileResponseDto.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> createAudioBook(
            @PathVariable Long ttsId,
            @PathVariable Long bookId) throws IOException;

    @Operation(summary = "TTS 학습 시작", description = "녹음한 음성파일로 TTS 학습 시작합니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "생성 성공", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> trainTTS(@PathVariable Long ttsId) throws IOException;

    @Operation(summary = "TTS 낭독", description = "현재 페이지의 tts 음성반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> pageAudio(@PathVariable Long ttsId,@PathVariable Long bookId, @RequestParam Integer pageNum) throws IOException;

    /////////////임시 ///////////////////
//    @Operation(summary = "추론 결과 저장 ", description = "결과 저장 ")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "조회", content = @Content),
//            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
//    })
//    public ResponseEntity<?> tempSaveResult(@RequestBody temp temp) throws IOException;

    @Operation(summary = "TTS 목록 조회(자녀 페이지)", description = "책읽기 시작 시 TTS 선택하는 페이지")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<?> childTTSList(@PathVariable Long bookId ) throws IOException;


}
