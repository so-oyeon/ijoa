package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.TrainAudio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainAudioRepository extends JpaRepository<TrainAudio,Long> {
    TrainAudio findByTtsIdAndScriptId(Long ttsId, Long scriptId);
}
