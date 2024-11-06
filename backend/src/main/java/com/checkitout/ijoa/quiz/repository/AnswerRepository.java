package com.checkitout.ijoa.quiz.repository;

import com.checkitout.ijoa.quiz.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
