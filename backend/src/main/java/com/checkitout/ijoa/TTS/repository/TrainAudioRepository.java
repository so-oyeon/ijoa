package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.TrainAudio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
public interface TrainAudioRepository extends JpaRepository<TrainAudio,Long> {
    TrainAudio findByTtsIdAndScriptId(Long ttsId, Long scriptId);
    Optional<List<TrainAudio>> findByTtsIdOrderByScriptId(Long ttsId);
    List<TrainAudio> findByTtsId(Long ttsId);
}
