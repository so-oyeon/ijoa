package com.checkitout.ijoa.quiz.repository;

import com.checkitout.ijoa.quiz.domain.QuizBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface QuizBookRepository extends JpaRepository<QuizBook,Long> {
    Page<QuizBook> findByChildIdAndCreatedAtBetween(Long childId, LocalDate start, LocalDate end,Pageable pageable);
    QuizBook findByChildIdAndFairytaleId(Long childId, Long fairytaleId);
}
