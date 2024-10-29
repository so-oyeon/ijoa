package com.checkitout.ijoa.fairytale.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "fairytale_page")
public class FairytalePage {
    @Id
    @GeneratedValue
    @Column(name = "fairytale_page_id")
    private Long id;

    @Column(name = "page_number")
    private Integer pageNumber;

    private String content;

    @Column(name = "sentence_count")
    private Integer sentenceCount;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_id")
    private Fairytale fairytale;

    private FairytalePage(Integer pageNumber, String content, Integer sentenceCount, Integer wordCount, String imageUrl,
                          Fairytale fairytale) {
        this.pageNumber = pageNumber;
        this.content = content;
        this.sentenceCount = sentenceCount;
        this.wordCount = wordCount;
        this.imageUrl = imageUrl;
        this.fairytale = fairytale;
    }

    public static FairytalePage of(Integer pageNumber, String content, Integer sentenceCount, Integer wordCount,
                                   String imageUrl, Fairytale fairytale) {
        return new FairytalePage(pageNumber, content, sentenceCount, wordCount, imageUrl, fairytale);
    }
}
