package com.checkitout.ijoa.TTS.service;


import com.checkitout.ijoa.TTS.domain.*;
import com.checkitout.ijoa.TTS.dto.request.*;
import com.checkitout.ijoa.TTS.dto.response.*;
import com.checkitout.ijoa.TTS.repository.*;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.dto.response.FairytalePageResponseDto;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.file.service.FileService;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.service.EmailServie;
import com.checkitout.ijoa.util.LogUtil;
import com.checkitout.ijoa.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional
public class TTSService {

    private final RedissonClient redissonClient;
    private final KafkaTemplate<String, AudioBookRequestDto> audioBookKafkaTemplate;
    private final KafkaTemplate<String, TrainAudioResponseDto> trainAudioKafkaTemplate;
    // 동화책 audio만들기
    private static final String REQUEST_TOPIC = "tts_create_audio";
    // 생성된 audio s3키 저장
    private static final String RESPONSE_TOPIC = "tts_save_audio";
    // tts 모델 생성 시작
    private static final String TTS_CREATE_TOPIC = "create_tts";
    // tts 모델 경로 저장
    private static final String TTS_MODEL_TOPIC =  "tts_model_path";


    private final SecurityUtil securityUtil;

    private final FileService fileService;
    private final EmailServie emailServie;

    private final TTSRepository ttsRepository;
    private final ScriptRepository scriptRepository;
    private final TrainAudioRepository trainAudioRepository;
    private final FairytaleTTSRepository fairytaleTTSRepository;
    private final AudioRepository audioRepository;
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;;

    // TTS 프로필 생성
    public TTSProfileResponseDto createTTS(TTSProfileRequestDto requestDto) throws IOException {
        User user = securityUtil.getUserByToken();
        int num = ttsRepository.countByUserId(user.getId());
        if(num==4){
            throw new CustomException(ErrorCode.TTS_LIMIT_EXCEEDED);
        }

        String url = fileService.saveProfileImage(requestDto.getImage());

        TTS newTTS = TTSProfileRequestDto.of(requestDto,url,user);

        TTS savedTTS = ttsRepository.save(newTTS);
        return TTSProfileResponseDto.fromTTS(savedTTS,false);
    }

    // TTS 삭제
    public void deleteTTS(Long ttsId) {
        User user = securityUtil.getUserByToken();

        // TTS 있는지 확인
        TTS deleteTTS = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));

        // 생성자인지 확인
        checkUser(deleteTTS,user.getId());

        //s3 파일 삭제
        // 프로필 이미지 삭제
        fileService.deleteFile(deleteTTS.getImage());
        // 학습 데이터 삭제
        List<TrainAudio> trainAudios = trainAudioRepository.findByTtsId(deleteTTS.getId());
        if(trainAudios!=null){
            for(TrainAudio trainAudio : trainAudios){
                fileService.deleteFile(trainAudio.getFile_path());
            }
        }

        // 책 오디오 삭제
        List<FairytaleTTS> fairytaleTTSList =  fairytaleTTSRepository.findByTtsId(deleteTTS.getId());
        if(fairytaleTTSList!=null){
            for(FairytaleTTS fairytaleTTS : fairytaleTTSList){
                List<Audio> audioList = audioRepository.findByFairytaleTTS(fairytaleTTS);
                if(audioList!=null){
                    for(Audio audio : audioList){
                        fileService.deleteFile(audio.getAudio());
                    }
                }
            }
        }
        ttsRepository.delete(deleteTTS);
    }

    // TTS 수정
    public TTSProfileResponseDto updateTTS(Long ttsId, TTSProfileUpdateRequestDto requestDto) throws IOException {
        User user = securityUtil.getUserByToken();

        TTS updateTTS = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));
        checkUser(updateTTS,user.getId());

        if(requestDto.getImage() != null && !requestDto.getImage().isEmpty()){
            //기존 이미지 s3삭제
            fileService.deleteFile(updateTTS.getImage());

            String url = fileService.saveProfileImage(requestDto.getImage());
            updateTTS.setImage(url);
        }

        if( requestDto.getName()!=null &&!requestDto.getName().isEmpty()){
            updateTTS.setName(requestDto.getName());
        }

        TTS updatedTTS = ttsRepository.save(updateTTS);

        return TTSProfileResponseDto.fromTTS(updatedTTS,trainAudioRepository.existsByTtsId(updateTTS.getId()));
    }

    // 부모 tts 목록
    public List<TTSProfileResponseDto> getTTSList() {
        List<TTSProfileResponseDto> responseDtos = new ArrayList<>();

        User user = securityUtil.getUserByToken();

        List<TTS> ttsList = ttsRepository.findByUserId(user.getId()).orElseThrow(()-> new CustomException(ErrorCode.TTS_NO_CONTENT));

        for(TTS ts : ttsList){
            responseDtos.add(TTSProfileResponseDto.fromTTS(ts,trainAudioRepository.existsByTtsId(ts.getId())));
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

        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        for(FileScriptPair pair: requestDto.getFileScriptPairs()){
            Script script= scriptRepository.findById(pair.getScriptId()).orElseThrow(()-> new CustomException( ErrorCode.SCRIPT_NOT_FOUND));
            // filename 설정하기(profile 경로 + 멤버ID + 랜덤 값)
            String key = "train/" + ttsId + "/" + currentTime + "/" + pair.getFileName();
            //url 발급
            String url = fileService.getPostS3Url(key);
            // TODO  s3 저장기간 설정

            TrainAudio trainAudio = trainAudioRepository.findByTtsIdAndScriptId(ttsId, pair.getScriptId());
            // trainAudio가 존재하면 업데이트, 존재하지 않으면 새로운 객체 생성 후 저장
            if (trainAudio != null) {
                // s3 학습 데이터 삭제
                fileService.deleteFile(trainAudio.getFile_path());
                trainAudio.update(key);
            } else {
                trainAudio = TrainAudio.of(tts, script, key);
            }
            trainAudioRepository.save(trainAudio);

            responseDtos.add(TTSTrainResponseDto.builder().key(key).url(url).build());
        }

        return responseDtos;

    }

    // tts모델 학습 시작
    public void startTrain(Long ttsId) {
        // 학습데이터
        List<TrainAudio> trainAudios = trainAudioRepository.findByTtsIdOrderByScriptId(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TRAINAUDIO_NOT_FOUND));
        //s3경로
        List<String> paths = new ArrayList<>();

        for(TrainAudio trainAudio : trainAudios){
            paths.add(trainAudio.getFile_path());
        }

        TrainAudioResponseDto responseDto = TrainAudioResponseDto.from(ttsId, paths);
        trainAudioKafkaTemplate.send(TTS_CREATE_TOPIC, responseDto);
    }


    // db 저장

    // 모델경로 db 저장
    @KafkaListener(topics = TTS_MODEL_TOPIC, groupId = "tts_group", containerFactory = "modelPathKafkaListenerContainerFactory")
    public void saveModelPath(ModelPathDto modelPathDto) {
        String modelPath = modelPathDto.getModelPath();
        Long ttsId = modelPathDto.getTtsId();
        TTS tts = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));
        tts.setTTS(modelPath);
        TTS savedTts = ttsRepository.save(tts);

        // 생성완료 이메일 전송
        String email = savedTts.getUser().getEmail();
        emailServie.sendCompleteEmail(email);
    }

    // 동화책 audio 생성
    public void createAudioBook(Long bookId, Long ttsId) {

        List<FairytalePageContent> contents = fairytalePageContentRepository.findByfairytaleId(bookId).orElseThrow(() -> new CustomException(ErrorCode.FAIRYTALE_NOT_FOUND));
        TTS tts = ttsRepository.findById(ttsId).orElseThrow(() -> new CustomException(ErrorCode.TTS_NOT_FOUND));

        String lockKey = "createAudioBook:"+bookId+"_ttsId:"+ttsId;
        RBucket<String> statusFlag = redissonClient.getBucket(lockKey);

        // 상태 플래그가 없으면 플래그를 설정하고 true 반환, 이미 존재하면 false 반환
        if(!statusFlag.setIfAbsent("IN_PROGRESS")){
            throw new CustomException(ErrorCode.AUDIO_CREATION_ALREADY_IN_PROGRESS);
        }else{
            // 만료 시간 설정
            statusFlag.expire(10, TimeUnit.MINUTES);

            List<FairytalePageResponseDto> pages = new ArrayList<>();
            for (FairytalePageContent content : contents) {
                pages.add(FairytalePageResponseDto.from(content));
            }

            AudioBookRequestDto audioBookRequest = AudioBookRequestDto.builder()
                    .bookId(bookId)
                    .modelPath(tts.getTTS())
                    .pages(pages)
                    .ttsId(ttsId)
                    .build();

            // Kafka로 메시지 전송
            audioBookKafkaTemplate.send(REQUEST_TOPIC, audioBookRequest);

        }

    }

    // 생성된 audio파일 정보 db 저장
    @KafkaListener(topics = RESPONSE_TOPIC, groupId = "tts_group",containerFactory = "audioPathKafkaListenerContainerFactory")
    public void consumeResponse(AudioPathDto audioPathDto) {
        Long bookId = audioPathDto.getBookId();
        Long ttsId = audioPathDto.getTtsId();
        List<Map<String, String>> s3Keys = audioPathDto.getS3Keys();

        Fairytale fairytale = fairytaleRepository.findById(bookId).orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_NOT_FOUND));
        TTS tts = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));

        // 동화책 tts
        //있으면 업데이트 없으면 새로 만들기
        FairytaleTTS fairytaleTTS = fairytaleTTSRepository.findByFairytaleAndTts(fairytale, tts)
                .orElse(FairytaleTTS.of(fairytale, tts));
        fairytaleTTS = fairytaleTTSRepository.save(fairytaleTTS);

        // 각 오디오 파일의 경로를 DB에 저장
        for (Map<String, String> s3Info : s3Keys) {
            FairytalePageContent pageContent = fairytalePageContentRepository.findById(Long.parseLong(s3Info.get("pageId")))
                    .orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_PAGE_NOT_FOUND));
            String s3Path = s3Info.get("s3_key");

            // DB에 S3 파일 경로 업데이트
            Audio audio = audioRepository.findByFairytaleTTSAndPage(fairytaleTTS, pageContent)
                    .map(existingAudio -> {
                        existingAudio.setAudio(s3Path); // 경로 업데이트
                        return existingAudio;
                    })
                    .orElse(Audio.of(fairytaleTTS, pageContent, s3Path));
            audioRepository.save(audio);
        }

        // 상태 변환
        String lockKey = "createAudioBook:"+bookId+"_ttsId:"+ttsId;
        RBucket<String> statusFlag = redissonClient.getBucket(lockKey);
        statusFlag.delete();

    }


    // 해당 페이지 음성 반환
    public PageAudioDto findPageAudio(Long ttsId, Long bookId, Integer pageNum) {
        TTS tts = ttsRepository.findById(ttsId).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));
        Fairytale fairytale = fairytaleRepository.findById(bookId).orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_NOT_FOUND));

        if(pageNum == null || pageNum < 1 || pageNum > fairytale.getTotalPages()){
            throw new CustomException(ErrorCode.FAIRYTALE_PAGE_NOT_FOUND);
        }

        FairytalePageContent page = fairytalePageContentRepository.findByFairytaleAndPageNumber(fairytale, pageNum) .orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_PAGE_NOT_FOUND));
        FairytaleTTS fairytaleTTS = fairytaleTTSRepository.findByFairytaleAndTts(page.getFairytale(), tts).orElseThrow(()-> new CustomException(ErrorCode.TTS_NOT_FOUND));
        Audio audio = audioRepository.findByFairytaleTTSAndPage(fairytaleTTS, page).orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_PAGE_NOT_FOUND));
        String url = fileService.getGetS3Url(audio.getAudio());
        return PageAudioDto.from(url);
    }

    // 자녀페이지 TTS리스트
    public List<ChildTTSListDto> childTTSList(Long bookId) {
        User user = securityUtil.getUserByToken();
        List<TTS> ttsList = ttsRepository.findByUserId(user.getId()).orElseThrow(()-> new CustomException(ErrorCode.TTS_NO_CONTENT) );
        Fairytale fairytale = fairytaleRepository.findById(bookId).orElseThrow(()-> new CustomException(ErrorCode.FAIRYTALE_NOT_FOUND));
        List<ChildTTSListDto> childTTSListDtos = new ArrayList<>();
        for(TTS tts : ttsList){
            if(tts.getTTS() ==null){
                continue;
            }
            boolean audio_created = fairytaleTTSRepository.existsByFairytaleAndTts(fairytale, tts);
            childTTSListDtos.add(ChildTTSListDto.from(tts, audio_created));
        }
        return childTTSListDtos;

    }

    // 권한 확인
    private void checkUser(TTS tts, Long userId) {
        if(!tts.getUser().getId().equals(userId)){
            throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
        }
    }

}
