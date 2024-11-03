package com.checkitout.ijoa.TTS.service;


import com.checkitout.ijoa.TTS.domain.*;
import com.checkitout.ijoa.TTS.dto.request.FileScriptPair;
import com.checkitout.ijoa.TTS.dto.response.AudioBookRequestDto;
import com.checkitout.ijoa.TTS.repository.*;
import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.TTS.dto.request.TTSTrainRequestDto;
import com.checkitout.ijoa.TTS.dto.response.ScriptResponseDto;
import com.checkitout.ijoa.TTS.dto.response.TTSProfileResponseDto;
import com.checkitout.ijoa.TTS.dto.response.TTSTrainResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.dto.response.FairytalePageResponseDto;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.file.service.FileService;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class TTSService {

    private final KafkaTemplate<String, AudioBookRequestDto> kafkaTemplate;
    private static final String REQUEST_TOPIC = "tts_create_audio";
    private static final String RESPONSE_TOPIC = "tts_save_audio";

    private final SecurityUtil securityUtil;
    private final FileService fileService;

    private final TTSRepository ttsRepository;
    private final ScriptRepository scriptRepository;
    private final TrainAudioRepository trainAudioRepository;
    private final FairytaleTTSRepository fairytaleTTSRepository;
    private final AudioRepository audioRepository;
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;;

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

            TrainAudio trainAudio = trainAudioRepository.findByTtsIdAndScriptId(ttsId, pair.getScriptId());
            // trainAudio가 존재하면 업데이트, 존재하지 않으면 새로운 객체 생성 후 저장
            if (trainAudio != null) {
                trainAudio.update(key);
            } else {
                trainAudio = TrainAudio.of(tts, script, key);
            }
            trainAudioRepository.save(trainAudio);

            responseDtos.add(TTSTrainResponseDto.builder().key(key).url(url).build());
        }

        return responseDtos;

    }

    // 동화책 audio 생성
    public void createAudioBook(Long bookId, Long ttsId) {
        //TODO tts id로 modelpath 찾기
        String modelPath = "/home/j-k11d105/ijoa/app/run/training/GPT_XTTS_v2.0-October-29-2024_02+49PM-0000000/";

        // TODO bookId로 content 찾기
        List<FairytalePageResponseDto> pages = new ArrayList<>();
        pages.add(FairytalePageResponseDto.builder().pageId(1L).text("노마가 장난감 친구들을 찾아 나섰어요. 로켓을 타고 우주로 슈웅! 노마는 망원경으로 여기저기 살펴보았어요.").build());
        pages.add(FairytalePageResponseDto.builder().pageId(2L).text("밍밍이에게 고민이 생겼어요. 친구들과 놀고 싶지 않았어요. 사탕과 과자도 먹고 싶지 않았어요. 방에 쪼그리고 앉아서 한숨만 휴우. 도대체 무슨 일일까요?").build());

        AudioBookRequestDto audioBookRequest = AudioBookRequestDto.builder()
                .bookId(bookId)
                .modelPath(modelPath)
                .pages(pages)
                .ttsId(ttsId)
                .build();


        // Kafka로 메시지 전송
        kafkaTemplate.send(REQUEST_TOPIC, audioBookRequest);
    }


    // 생성된 audio파일 정보 db 저장
    @KafkaListener(topics = RESPONSE_TOPIC, groupId = "tts_group")
    public void consumeResponse(Map<String, Object> message) {
        Long bookId = Long.valueOf(message.get("book_id").toString());
        Long ttsId = Long.valueOf(message.get("tts_id").toString());
        List<Map<String, String>> s3Keys = (List<Map<String, String>>) message.get("s3_keys");

        Fairytale fairytale = fairytaleRepository.findById(bookId).orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_NOT_FOUND));
        TTS tts = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));

        // TODO 이미 있으면 update
        FairytaleTTS fairytaleTTS = FairytaleTTS.of(fairytale,tts);
        fairytaleTTS = fairytaleTTSRepository.save(fairytaleTTS);

        // 각 오디오 파일의 경로를 DB에 저장
        for (Map<String, String> s3Info : s3Keys) {
            FairytalePageContent pageContent = fairytalePageContentRepository.findById(Long.parseLong(s3Info.get("pageId")))
                    .orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_PAGE_NOT_FOUND));
            String s3Path = s3Info.get("s3_key");

            // TODO 있으면 update
            // DB에 S3 파일 경로 업데이트
            Audio audio = Audio.of(fairytaleTTS, pageContent, s3Path);
            audioRepository.save(audio);
        }
    }

    // 권한 확인
    private void checkUser(TTS tts, Long userId) {
        if(!tts.getUser().getId().equals(userId)){
            throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
        }
    }
}
