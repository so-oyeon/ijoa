package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {
}
