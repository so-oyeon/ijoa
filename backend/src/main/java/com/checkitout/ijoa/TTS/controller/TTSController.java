package com.checkitout.ijoa.TTS.controller;

import com.checkitout.ijoa.TTS.docs.TTSApiDocumentation;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.response.TTSProfileResponseDto;
import com.checkitout.ijoa.TTS.service.TTSService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tts")
public class TTSController implements TTSApiDocumentation {

    private final TTSService ttsService;

    @Override
    @PostMapping("/profile")
    public ResponseEntity<TTSProfileResponseDto> createTTSProfile(@Valid @RequestBody TTSProfileRequestDto requestDto) throws IOException {
        TTSProfileResponseDto responseDto = ttsService.createTTS(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @Override
    @DeleteMapping("/{ttsId}")
    public ResponseEntity<?> deleteTTSProfile(@PathVariable("ttsId") Long ttsId) throws IOException {
        ttsService.deleteTTS(ttsId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
