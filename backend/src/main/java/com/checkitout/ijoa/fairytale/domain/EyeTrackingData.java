package com.checkitout.ijoa.fairytale.domain;

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
public class EyeTrackingData {
    @Id
    @GeneratedValue
    @Column(name = "eye_tracking_data_id")
    private Long id;

    @Column(nullable = false)
    private LocalDateTime trackedAt;

    @Column(nullable = false)
    private Boolean isFaceMissing;

    private Boolean isGazeOutOfScreen;

    private Float gazeX;

    private Float gazeY;

    private Float pupilSize;

    private Float attentionRate;

    private String word;

    @Column(nullable = false)
    private Boolean isImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_history_id", nullable = false)
    private PageHistory pageHistory;


    public EyeTrackingData(LocalDateTime trackedAt, Boolean isFaceMissing, Boolean isGazeOutOfScreen, Float gazeX,
                           Float gazeY, Float pupilSize, Float attentionRate, String word, Boolean isImage,
                           PageHistory pageHistory) {
        this.trackedAt = trackedAt;
        this.isFaceMissing = isFaceMissing;
        this.isGazeOutOfScreen = isGazeOutOfScreen;
        this.gazeX = gazeX;
        this.gazeY = gazeY;
        this.pupilSize = pupilSize;
        this.attentionRate = attentionRate;
        this.word = word;
        this.isImage = isImage;
        this.pageHistory = pageHistory;
    }

    public static EyeTrackingData of(LocalDateTime trackedAt, Boolean isFaceMissing, Boolean isGazeOutOfScreen,
                                     Float gazeX, Float gazeY, Float pupilSize, Float attentionRate, String word,
                                     Boolean isImage, PageHistory pageHistory) {
        return new EyeTrackingData(trackedAt, isFaceMissing, isGazeOutOfScreen, gazeX, gazeY, pupilSize, attentionRate,
                word, isImage, pageHistory);
    }
}
