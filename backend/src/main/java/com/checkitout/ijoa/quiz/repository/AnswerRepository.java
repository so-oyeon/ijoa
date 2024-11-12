package com.checkitout.ijoa.quiz.repository;

import com.checkitout.ijoa.quiz.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Optional<List<Answer>> findByChildIdAndQuizBookFairytaleId(Long childId, Long fairytaleId);
    Answer findByChildIdAndQuizId(Long childId, Long quizId);
}
