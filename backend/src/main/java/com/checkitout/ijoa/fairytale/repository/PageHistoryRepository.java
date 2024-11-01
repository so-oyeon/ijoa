package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.PageHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageHistoryRepository extends JpaRepository<PageHistory, Long> {
}
