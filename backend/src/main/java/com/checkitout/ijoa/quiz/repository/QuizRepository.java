package com.checkitout.ijoa.quiz.repository;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.quiz.domain.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz,Long> {
    Quiz findByFairytaleAndPagePageNumber(Fairytale fairytale, Integer pageId);
}
