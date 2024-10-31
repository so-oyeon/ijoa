package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.FairytalePageImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FairytalePageImageRepository extends JpaRepository<FairytalePageImage, Long> {
}
