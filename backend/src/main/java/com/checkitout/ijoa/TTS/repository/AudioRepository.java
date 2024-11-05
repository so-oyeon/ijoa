package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.Audio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioRepository extends JpaRepository<Audio, Long> {
}
