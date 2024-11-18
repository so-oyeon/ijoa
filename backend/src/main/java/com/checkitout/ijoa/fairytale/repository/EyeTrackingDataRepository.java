package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import jakarta.persistence.Tuple;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EyeTrackingDataRepository extends JpaRepository<EyeTrackingData, Long> {

    @Query("""
                SELECT FUNCTION('date_format', e.trackedAt, :format) as timeKey,
                       AVG(CASE WHEN e.isGazeOutOfScreen = false THEN e.attentionRate ELSE 0 END) * 100 as averageAttention
                FROM EyeTrackingData e
                WHERE e.pageHistory.child = :child
                AND e.trackedAt >= :startTime
                AND e.trackedAt < :endTime
                GROUP BY FUNCTION('date_format', e.trackedAt, :format)
                ORDER BY FUNCTION('date_format', e.trackedAt, :format)
            """)
    List<Object[]> findAggregatedDataByChildAndDateRange(
            @Param("child") Child child,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("format") String format
    );

    @Query("""
            SELECT e.word as word, COUNT(e) as focusCount
            FROM EyeTrackingData e
            JOIN e.pageHistory ph
            WHERE ph.child = :child
            AND e.isGazeOutOfScreen = false
            AND e.isImage = false
            AND e.word IS NOT NULL
            GROUP BY e.word
            ORDER BY COUNT(e) DESC
            LIMIT :limit
            """)
    List<Tuple> findWordFocusCount(@Param("child") Child child, @Param("limit") Integer limit);

    List<EyeTrackingData> findByPageHistory_Child(Child child);
}