package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.FairytaleTTS;
import com.checkitout.ijoa.TTS.domain.TTS;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FairytaleTTSRepository extends JpaRepository<FairytaleTTS, Long> {
    Optional<FairytaleTTS> findByFairytaleAndTts(Fairytale fairytale, TTS tts);
}
