package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.TTS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TTSRepository extends JpaRepository<TTS, Long> {
    Optional<List<TTS>> findByUserId(Long id);
    int countByUserId(Long id);
}
