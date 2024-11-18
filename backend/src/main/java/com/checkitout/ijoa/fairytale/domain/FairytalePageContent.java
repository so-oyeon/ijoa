package com.checkitout.ijoa.fairytale.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FairytalePageContent {
    @Id
    @GeneratedValue
    @Column(name = "fairytale_page_content_id")
    private Long id;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber;

    @Column(nullable = false)
    private String content;

    @Column(name = "sentence_count", nullable = false)
    private Integer sentenceCount;

    @Column(name = "word_count", nullable = false)
    private Integer wordCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_page_image_id", nullable = false)
    private FairytalePageImage fairytalePageImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_id", nullable = false)
    private Fairytale fairytale;

    private FairytalePageContent(Integer pageNumber, String content, Integer sentenceCount, Integer wordCount,
                                 FairytalePageImage fairytalePageImage, Fairytale fairytale) {
        this.pageNumber = pageNumber;
        this.content = content;
        this.sentenceCount = sentenceCount;
        this.wordCount = wordCount;
        this.fairytalePageImage = fairytalePageImage;
        this.fairytale = fairytale;
    }

    public static FairytalePageContent of(Integer pageNumber, String content, Integer sentenceCount, Integer wordCount,
                                          FairytalePageImage fairytalePageImage, Fairytale fairytale) {
        return new FairytalePageContent(pageNumber, content, sentenceCount, wordCount, fairytalePageImage, fairytale);
    }
}
