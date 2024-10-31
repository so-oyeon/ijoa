package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FairytalePageContentRepository extends JpaRepository<FairytalePageContent, Long> {
}
