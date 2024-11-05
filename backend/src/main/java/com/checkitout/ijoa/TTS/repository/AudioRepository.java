package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.Audio;
import com.checkitout.ijoa.TTS.domain.FairytaleTTS;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AudioRepository extends JpaRepository<Audio, Long> {
    Optional<Audio> findByFairytaleTTSAndPage(FairytaleTTS fairytaleTts, FairytalePageContent page);
}
