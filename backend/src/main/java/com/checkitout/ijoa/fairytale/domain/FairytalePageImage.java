package com.checkitout.ijoa.fairytale.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "fairytale_page_image")
public class FairytalePageImage {
    @Id
    @GeneratedValue
    @Column(name = "fairytale_page_image_id")
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_id", nullable = false)
    private Fairytale fairytale;

    @OneToMany(mappedBy = "fairytalePageImage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FairytalePageContent> fairytalePageContents = new ArrayList<>();

    private FairytalePageImage(String imageUrl, Fairytale fairytale) {
        this.imageUrl = imageUrl;
        this.fairytale = fairytale;
    }

    public static FairytalePageImage of(String imageUrl, Fairytale fairytale) {
        return new FairytalePageImage(imageUrl, fairytale);
    }

    public FairytalePageContent getFirstFairytalePageContent() {
        return fairytalePageContents.stream()
                .min(Comparator.comparing(FairytalePageContent::getPageNumber))
                .orElse(null);
    }
}
