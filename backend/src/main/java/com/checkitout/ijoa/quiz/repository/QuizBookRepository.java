package com.checkitout.ijoa.quiz.repository;

import com.checkitout.ijoa.quiz.domain.QuizBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizBookRepository extends JpaRepository<QuizBook,Long> {
}
