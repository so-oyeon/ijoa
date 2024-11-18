package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import jakarta.persistence.Tuple;
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
            ORDER BY e.trackedAt ASC
            """)
    List<EyeTrackingData> findTrackedDataByChild(@Param("child") Child child);

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