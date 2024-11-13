package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildReadBooksRepository extends JpaRepository<ChildReadBooks, Long> {

    @Query("""
            SELECT f.category, sum(crb.completionCount)
            FROM ChildReadBooks crb
            JOIN crb.fairytale f
            WHERE crb.child = :child
            AND crb.isCompleted = true
            GROUP BY f.category
            ORDER BY COUNT(crb) DESC
            """)
    List<Object[]> countByCategoryAndChild(@Param("child") Child child);

    Optional<ChildReadBooks> findByChildIdAndFairytaleId(Long childId, Long bookId);

    Page<ChildReadBooks> findByChildIdOrderByFairytaleIdAsc(Long childId, Pageable pageable);

    Long countByChildAndIsCompletedTrue(Child child);
}
