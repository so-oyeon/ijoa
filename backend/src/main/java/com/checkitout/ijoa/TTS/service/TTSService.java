package com.checkitout.ijoa.TTS.service;


import com.checkitout.ijoa.TTS.domain.Script;
import com.checkitout.ijoa.TTS.domain.TTS;
import com.checkitout.ijoa.TTS.domain.TrainAudio;
import com.checkitout.ijoa.TTS.dto.request.FileScriptPair;
import com.checkitout.ijoa.TTS.repository.ScriptRepository;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.request.TTSTrainRequestDto;
import com.checkitout.ijoa.TTS.dto.response.ScriptResponseDto;
import com.checkitout.ijoa.TTS.dto.response.TTSProfileResponseDto;
import com.checkitout.ijoa.TTS.dto.response.TTSTrainResponseDto;
import com.checkitout.ijoa.TTS.repository.TTSRepository;
import com.checkitout.ijoa.TTS.repository.TrainAudioRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.file.service.FileService;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TTSService {

    private final SecurityUtil securityUtil;
    private final FileService fileService;

    private final TTSRepository ttsRepository;
    private final ScriptRepository scriptRepository;
    private final TrainAudioRepository trainAudioRepository;

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

    // 학습 데이터 저장
    public List<TTSTrainResponseDto> saveTrainData(Long ttsId, TTSTrainRequestDto requestDto) {
        List<TTSTrainResponseDto> responseDtos = new ArrayList<>();
        TTS tts = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));

        for(FileScriptPair pair: requestDto.getFileScriptPairs()){
            Script script= scriptRepository.findById(pair.getScriptId()).orElseThrow(()-> new CustomException( ErrorCode.SCRIPT_NOT_FOUND));
            // filename 설정하기(profile 경로 + 멤버ID + 랜덤 값)
            String key = "train/" + ttsId + "/" + UUID.randomUUID() + "/" + pair.getFileName();
            //url 발급
            String url = fileService.getPostS3Url(key);

            // db저장
            TrainAudio trainAudio = TrainAudio.of(tts,script,key);
            trainAudioRepository.save(trainAudio);

            responseDtos.add(TTSTrainResponseDto.builder().key(key).url(url).build());
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
