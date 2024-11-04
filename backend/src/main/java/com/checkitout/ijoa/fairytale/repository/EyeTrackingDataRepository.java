package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EyeTrackingDataRepository extends JpaRepository<EyeTrackingData, Long> {
}
