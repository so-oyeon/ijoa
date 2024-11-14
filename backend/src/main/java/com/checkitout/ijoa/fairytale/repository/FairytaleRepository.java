package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {

    Page<Fairytale> findAllBy(Pageable pageable);

    Page<Fairytale> findByCategory(CATEGORY category, Pageable pageable);

    @Query("""
            SELECT DISTINCT f
            FROM Fairytale f
            LEFT JOIN f.childReadBooks crb ON FUNCTION('YEAR', crb.child.birth) = FUNCTION('YEAR', :childBirth)
            GROUP BY f.id
            ORDER BY SUM(COALESCE(crb.completionCount, 0)) DESC
            LIMIT :recommendationCount
            """)
    List<Fairytale> findPopularFairytalesByAgeGroup(@Param("childBirth") LocalDate childBirth,
                                                    @Param("recommendationCount") Integer recommendationCount);
}
