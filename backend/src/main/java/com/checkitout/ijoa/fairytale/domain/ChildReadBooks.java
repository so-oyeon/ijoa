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

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChildReadBooks {
    @Id
    @GeneratedValue
    @Column(name = "child_read_books_id")
    private Long id;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private Integer currentPage;

    private LocalDateTime finishedAt;

    @Column(nullable = false)
    private Boolean isCompleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_id", nullable = false)
    private Fairytale fairytale;

    public ChildReadBooks(LocalDateTime createdAt, Integer currentPage, LocalDateTime finishedAt, Boolean isCompleted,
                          Child child, Fairytale fairytale) {
        this.createdAt = createdAt;
        this.currentPage = currentPage;
        this.finishedAt = finishedAt;
        this.isCompleted = isCompleted;
        this.child = child;
        this.fairytale = fairytale;
    }

    public static ChildReadBooks of(LocalDateTime createdAt, Integer currentPage, LocalDateTime finishedAt,
                                    Boolean isCompleted,
                                    Child child, Fairytale fairytale) {
        return new ChildReadBooks(createdAt, currentPage, finishedAt, isCompleted, child, fairytale);
    }
}