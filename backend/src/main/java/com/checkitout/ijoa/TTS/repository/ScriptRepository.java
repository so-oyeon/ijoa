package com.checkitout.ijoa.TTS.repository;

import com.checkitout.ijoa.TTS.domain.Script;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScriptRepository extends JpaRepository<Script, Long> {
}
