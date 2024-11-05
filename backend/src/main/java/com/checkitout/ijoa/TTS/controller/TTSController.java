package com.checkitout.ijoa.TTS.controller;

import com.checkitout.ijoa.TTS.docs.TTSApiDocumentation;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.request.TTSTrainRequestDto;
import com.checkitout.ijoa.TTS.dto.response.ScriptResponseDto;
import com.checkitout.ijoa.TTS.dto.response.TTSProfileResponseDto;
import com.checkitout.ijoa.TTS.dto.response.TTSTrainResponseDto;
import com.checkitout.ijoa.TTS.service.TTSService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

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

    @Override
    @PatchMapping("/{ttsId}")
    public ResponseEntity<?> updateTTSProfile(@PathVariable("ttsId") Long ttsId, @RequestBody TTSProfileRequestDto requestDto) throws IOException {
        TTSProfileResponseDto responseDto = ttsService.updateTTS(ttsId,requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Override
    @GetMapping("/profile")
    public ResponseEntity<?> ParentTTSList() throws IOException {
        List<TTSProfileResponseDto> responseDtoList = ttsService.getTTSList();

        return new ResponseEntity<>(responseDtoList, HttpStatus.OK);
    }

    @Override
    @GetMapping("/script")
    public ResponseEntity<?> getScriptList() throws IOException {
        List<ScriptResponseDto> responseDtoList = ttsService.getSriptList();

        return new ResponseEntity<>(responseDtoList, HttpStatus.OK);
    }

    @Override
    @PostMapping("/train/{ttsId}")
    public ResponseEntity<?> saveTrainData(@PathVariable("ttsId") Long ttsId,@RequestBody TTSTrainRequestDto requestDto) throws IOException {
        List<TTSTrainResponseDto> savedTrainData = ttsService.saveTrainData(ttsId, requestDto);
        return new ResponseEntity<>(savedTrainData, HttpStatus.OK);
    }

    @Override
    @GetMapping("/audio-book/{bookId}/{TTSId}")
    public ResponseEntity<?> createAudioBook(@PathVariable("bookId") Long bookId,@PathVariable("TTSId") Long ttsId) throws IOException {
        ttsService.createAudioBook(bookId,ttsId);
        return new ResponseEntity<>( HttpStatus.OK);
    }

}
