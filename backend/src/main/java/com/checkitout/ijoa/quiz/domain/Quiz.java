package com.checkitout.ijoa.quiz.domain;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_id")
    private Fairytale fairytale;

    @OneToOne
    @JoinColumn(name = "fairytale_page_content_id")
    private FairytalePageContent page;

    @Column(length = 512)
    private String question;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Quiz(Fairytale fairytale, FairytalePageContent page, String question) {
        this.fairytale = fairytale;
        this.page = page;
        this.question = question;
    }

    public static Quiz of(Fairytale fairytale, FairytalePageContent page, String question) {
        return new Quiz(fairytale, page, question);
    }
}
