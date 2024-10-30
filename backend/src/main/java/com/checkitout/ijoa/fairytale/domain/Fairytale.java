package com.checkitout.ijoa.fairytale.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Fairytale {
    @Id
    @GeneratedValue
    @Column(name = "fairytale_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String illustrator;

    @Column(nullable = false)
    private String isbn;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "published_year", nullable = false)
    private Integer publishedYear;

    @Column(nullable = false)
    private String publisher;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CATEGORY category;

    @Column(name = "total_pages", nullable = false)
    private Integer totalPages;

    @OneToMany(mappedBy = "fairytale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FairytalePage> fairytalePages = new ArrayList<>();

    private Fairytale(String title, String author, String illustrator, String isbn, String imageUrl,
                      Integer publishedYear, String publisher, CATEGORY category, Integer totalPages) {
        this.title = title;
        this.author = author;
        this.illustrator = illustrator;
        this.isbn = isbn;
        this.imageUrl = imageUrl;
        this.publishedYear = publishedYear;
        this.publisher = publisher;
        this.category = category;
        this.totalPages = totalPages;
    }

    public static Fairytale of(String title, String author, String illustrator, String isbn, String imageUrl,
                               Integer publishedYear, String publisher, CATEGORY category, Integer totalPages) {
        return new Fairytale(title, author, illustrator, isbn, imageUrl, publishedYear, publisher, category,
                totalPages);
    }
}
