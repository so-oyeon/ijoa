package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.TTS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TTSRepository extends JpaRepository<TTS, Integer> {
}
