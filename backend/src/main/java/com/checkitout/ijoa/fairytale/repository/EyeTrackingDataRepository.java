package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import jakarta.persistence.Tuple;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EyeTrackingDataRepository extends JpaRepository<EyeTrackingData, Long> {

    @Query("""
                SELECT new map(
                                            CASE :period
                                                WHEN 'daily' THEN FUNCTION('HOUR', e.trackedAt)
                                                WHEN 'weekly' THEN FUNCTION('DAYOFWEEK', DATE(e.trackedAt))
                                                WHEN 'monthly' THEN FUNCTION('DAY', e.trackedAt)
                                                WHEN 'yearly' THEN FUNCTION('MONTH', e.trackedAt)
                                            END as timeSlot,
                                            AVG(CASE WHEN e.isGazeOutOfScreen = true THEN 0 ELSE e.attentionRate END) * 100 as avgAttention,
                                            COUNT(e) as count,
                                            CASE :period
                                                WHEN 'daily' THEN DATE(e.trackedAt)
                                                WHEN 'weekly' THEN DATE(e.trackedAt)
                                                WHEN 'monthly' THEN DATE(e.trackedAt)
                                                WHEN 'yearly' THEN DATE(e.trackedAt)
                                            END as trackedDate
                                        )
                                        FROM EyeTrackingData e
                                        WHERE e.pageHistory.child = :child
                                        AND e.trackedAt >= :startTime
                                        AND e.trackedAt < :endTime
                                        GROUP BY
                                            CASE :period
                                                WHEN 'daily' THEN FUNCTION('HOUR', e.trackedAt)
                                                WHEN 'weekly' THEN FUNCTION('DAYOFWEEK', DATE(e.trackedAt))
                                                WHEN 'monthly' THEN FUNCTION('DAY', e.trackedAt)
                                                WHEN 'yearly' THEN FUNCTION('MONTH', e.trackedAt)
                                            END,
                                            CASE :period
                                                WHEN 'daily' THEN DATE(e.trackedAt)
                                                WHEN 'weekly' THEN DATE(e.trackedAt)
                                                WHEN 'monthly' THEN DATE(e.trackedAt)
                                                WHEN 'yearly' THEN DATE(e.trackedAt)
                                            END
            """)
    List<Map<String, Object>> findAggregatedDataByChildAndDateRange(
            @Param("child") Child child,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("period") String period
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