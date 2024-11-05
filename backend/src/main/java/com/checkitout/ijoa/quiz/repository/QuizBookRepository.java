package com.checkitout.ijoa.quiz.repository;

import com.checkitout.ijoa.quiz.domain.QuizBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface QuizBookRepository extends JpaRepository<QuizBook,Long> {
    Optional<List<QuizBook>> findByChildIdAndCreatedAtBetween(Long childId, LocalDate startDate, LocalDate endDate);
}
