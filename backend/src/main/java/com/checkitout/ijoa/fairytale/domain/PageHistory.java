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
public class PageHistory {
    @Id
    @GeneratedValue
    @Column(name = "page_history_id")
    private Long id;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_page_content_id", nullable = false)
    private FairytalePageContent pageContent;

    private PageHistory(Child child, FairytalePageContent pageContent) {
        this.child = child;
        this.pageContent = pageContent;
    }

    public static PageHistory of(Child child, FairytalePageContent pageContent) {
        return new PageHistory(child, pageContent);
    }
}
