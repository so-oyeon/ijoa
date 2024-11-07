package com.checkitout.ijoa.TTS.controller;

import com.checkitout.ijoa.TTS.docs.TTSApiDocumentation;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.request.TTSTrainRequestDto;
import com.checkitout.ijoa.TTS.dto.response.*;
import com.checkitout.ijoa.TTS.service.TTSService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    @PostMapping(value = "/profile", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<TTSProfileResponseDto> createTTSProfile(@Valid @ModelAttribute TTSProfileRequestDto requestDto) throws IOException {
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
    @PatchMapping(value = "/{ttsId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateTTSProfile(@PathVariable("ttsId") Long ttsId, @ModelAttribute TTSProfileRequestDto requestDto) throws IOException {
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
        return new ResponseEntity<>(savedTrainData, HttpStatus.CREATED);
    }

    @Override
    @GetMapping("/audio-book/{bookId}/{TTSId}")
    public ResponseEntity<?> createAudioBook(@PathVariable("bookId") Long bookId,@PathVariable("TTSId") Long ttsId) throws IOException {
        ttsService.createAudioBook(bookId,ttsId);
        return new ResponseEntity<>( HttpStatus.OK);
    }

    @Override
    @GetMapping("/train/{ttsId}")
    public ResponseEntity<?> trainTTS(@PathVariable("ttsId") Long ttsId) throws IOException {
        ttsService.startTrain(ttsId);
        return new ResponseEntity<>( HttpStatus.OK);
    }

    @Override
    @GetMapping("/audios/{ttsId}/{bookId}")
    public ResponseEntity<?> pageAudio(@PathVariable("ttsId")Long ttsId,@PathVariable("bookId") Long bookId, @RequestParam("page") Integer pageNum) throws IOException {
        PageAudioDto responseDto = ttsService.findPageAudio(ttsId,bookId,pageNum);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
//
//    @Override
//    @PostMapping("/result")
//    public ResponseEntity<?> tempSaveResult(@RequestBody temp temp) throws IOException {
//        ttsService.consumeResponse(temp);
//        return null;
//    }

    @Override
    @GetMapping("/audios/{bookId}")
    public ResponseEntity<?> childTTSList(@PathVariable("bookId") Long bookId) throws IOException {
        List<ChildTTSListDto> responseDto = ttsService.childTTSList(bookId);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
