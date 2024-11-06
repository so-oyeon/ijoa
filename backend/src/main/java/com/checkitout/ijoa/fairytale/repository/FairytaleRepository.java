package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {

    @Query("SELECT new com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto(" +
            "f.id, f.title, f.imageUrl, f.totalPages, " +
            "COALESCE(crb.isCompleted, false), COALESCE(crb.currentPage, 0)) " +
            "FROM Fairytale f " +
            "LEFT JOIN f.childReadBooks crb " +
            "WHERE crb.child.id = :childId OR crb.child.id IS NULL")
    Page<FairytaleListResponseDto> findFairytalesByChildId(@Param("childId") Long childId, Pageable pageable);
}
