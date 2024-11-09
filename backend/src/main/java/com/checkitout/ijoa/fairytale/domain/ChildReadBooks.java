package com.checkitout.ijoa.fairytale.domain;

import com.checkitout.ijoa.child.domain.Child;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChildReadBooks {
    @Id
    @GeneratedValue
    @Column(name = "child_read_books_id")
    private Long id;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    private Integer currentPage;

    private LocalDateTime finishedAt;

    @Column(nullable = false)
    private Boolean isCompleted;

    @Column(nullable = false)
    private Integer completionCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_id", nullable = false)
    private Fairytale fairytale;


    public ChildReadBooks(Integer currentPage, LocalDateTime finishedAt, Boolean isCompleted,
                          Child child, Fairytale fairytale, Integer completionCount) {
        this.currentPage = currentPage;
        this.finishedAt = finishedAt;
        this.isCompleted = isCompleted;
        this.child = child;
        this.fairytale = fairytale;
        this.completionCount = completionCount;
    }

    public static ChildReadBooks of(Integer currentPage, LocalDateTime finishedAt,
                                    Boolean isCompleted,
                                    Child child, Fairytale fairytale, Integer completionCount) {
        return new ChildReadBooks(currentPage, finishedAt, isCompleted, child, fairytale, completionCount);
    }

    public void incrementCompletionCount() {
        this.completionCount++;
    }

    public void completeReading() {
        if (!this.isCompleted) {
            this.isCompleted = true;
            this.finishedAt = LocalDateTime.now();
        }
        incrementCompletionCount();
    }

    public void updateCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }
}