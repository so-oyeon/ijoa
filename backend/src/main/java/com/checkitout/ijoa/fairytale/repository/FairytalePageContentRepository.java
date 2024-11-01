package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FairytalePageContentRepository extends JpaRepository<FairytalePageContent, Long> {
    Optional<FairytalePageContent> findByFairytaleAndPageNumber(Fairytale fairytale, Integer pageNumber);
}
