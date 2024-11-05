package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EyeTrackingDataRepository extends JpaRepository<EyeTrackingData, Long> {

    @Query("""
            SELECT e FROM EyeTrackingData e
            WHERE e.pageHistory.child = :child
            AND e.trackedAt >= :startTime
            AND e.trackedAt < :endTime
            AND e.isFaceMissing = false
            ORDER BY e.trackedAt ASC
            """)
    List<EyeTrackingData> findTrackedDataByChildAndDateRange(
            @Param("child") Child child,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}