package com.checkitout.ijoa.TTS.service;


import com.checkitout.ijoa.TTS.domain.Script;
import com.checkitout.ijoa.TTS.domain.TTS;
import com.checkitout.ijoa.TTS.dto.request.ScriptRepository;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.response.ScriptResponseDto;
import com.checkitout.ijoa.TTS.dto.response.TTSProfileResponseDto;
import com.checkitout.ijoa.TTS.repository.TTSRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.service.UserService;
import com.checkitout.ijoa.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TTSService {

    private final SecurityUtil securityUtil;
    private final TTSRepository ttsRepository;
    private final ScriptRepository scriptRepository;

    // TTS 프로필 생성
    public TTSProfileResponseDto createTTS(TTSProfileRequestDto requestDto){
        User user = securityUtil.getUserByToken();
        int num = ttsRepository.countByUserId(user.getId());
        if(num==4){
            throw new CustomException(ErrorCode.TTS_LIMIT_EXCEEDED);
        }

        TTS newTTS = TTSProfileRequestDto.of(requestDto,user);

        TTS savedTTS = ttsRepository.save(newTTS);
        return TTSProfileResponseDto.fromTTS(savedTTS);
    }

    // TTS 삭제
    public void deleteTTS(Long ttsId) {
        User user = securityUtil.getUserByToken();

        // TTS 있는지 확인
        TTS deleteTTS = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));

        // 생성자인지 확인
        checkUser(deleteTTS,user.getId());

        ttsRepository.delete(deleteTTS);
    }

    // TTS 수정
    public TTSProfileResponseDto updateTTS(Long ttsId,TTSProfileRequestDto requestDto) {
        User user = securityUtil.getUserByToken();

        TTS updateTTS = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));
        checkUser(updateTTS,user.getId());

        updateTTS.updateTTS(requestDto);

        TTS updatedTTS = ttsRepository.save(updateTTS);

        return TTSProfileResponseDto.fromTTS(updatedTTS);
    }

    // 부모 tts 목록
    public List<TTSProfileResponseDto> getTTSList() {
        List<TTSProfileResponseDto> responseDtos = new ArrayList<>();

        User user = securityUtil.getUserByToken();

        List<TTS> ttsList = ttsRepository.findByUserId(user.getId()).orElseThrow(()-> new CustomException(ErrorCode.TTS_NO_CONTENT));

        for(TTS ts : ttsList){
            responseDtos.add(TTSProfileResponseDto.fromTTS(ts));
        }

        return responseDtos;
    }

    // 학습 시 녹음 스크립트 리스트
    public List<ScriptResponseDto> getSriptList() {
        List<ScriptResponseDto> responseDtos = new ArrayList<>();
        List<Script> scriptList = scriptRepository.findAll();
        for(Script script : scriptList){
            responseDtos.add(ScriptResponseDto.from(script));
        }

        return responseDtos;
    }


    // 권한 확인
    private void checkUser(TTS tts, Long userId) {
        if(!tts.getUser().getId().equals(userId)){
            throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
        }
    }

}
