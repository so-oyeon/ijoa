package com.checkitout.ijoa.TTS.service;


import com.checkitout.ijoa.TTS.domain.TTS;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.response.TTSProfileResponseDto;
import com.checkitout.ijoa.TTS.repository.TTSRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TTSService {

    private final SecurityUtil securityUtil;
    private final TTSRepository ttsRepository;

    // TTS 프로필 생성
    public TTSProfileResponseDto createTTS(TTSProfileRequestDto requestDto){
        User user = securityUtil.getUserByToken();

        TTS newTTS = TTSProfileRequestDto.from(requestDto,user);

        TTS savedTTS = ttsRepository.save(newTTS);
        return TTSProfileResponseDto.fromTTS(savedTTS);
    }

    // TTS 삭제
    public void deleteTTS(Long ttsId) {
        User user = securityUtil.getUserByToken();
        // TTS 생성자가 삭제할 수 있게
        TTS deleteTTS = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.UNAUTHORIZED_USER));

        ttsRepository.delete(deleteTTS);
    }
}
