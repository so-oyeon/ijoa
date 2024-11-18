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
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Document(indexName = "fairytale")
@ToString
public class Fairytale {
    @Id
    @GeneratedValue
    @Column(name = "fairytale_id")
    private Long id;

    @Field(type = FieldType.Text)
    @Column(nullable = false)
    private String title;

    @Field(type = FieldType.Text)
    @Column(nullable = false)
    private String author;

    @Field(type = FieldType.Text)
    @Column(nullable = false)
    private String illustrator;

    @Field(type = FieldType.Text)
    @Column(nullable = false)
    private String isbn;

    @Field(type = FieldType.Text, name = "image_url")
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Field(type = FieldType.Integer, name = "published_year")
    @Column(name = "published_year", nullable = false)
    private Integer publishedYear;

    @Field(type = FieldType.Text)
    @Column(nullable = false)
    private String publisher;

    @Field(type = FieldType.Text)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CATEGORY category;

    @Field(type = FieldType.Integer, name = "total_pages")
    @Column(name = "total_pages", nullable = false)
    private Integer totalPages;

    @OneToMany(mappedBy = "fairytale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FairytalePageContent> fairytalePageContents = new ArrayList<>();

    @OneToMany(mappedBy = "fairytale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FairytalePageImage> fairytalePageImages = new ArrayList<>();

    @OneToMany(mappedBy = "fairytale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChildReadBooks> childReadBooks = new ArrayList<>();

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