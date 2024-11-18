package com.checkitout.ijoa.TTS.domain;

import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Audio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_tts_id")
    private FairytaleTTS fairytaleTTS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_page_id")
    private FairytalePageContent page;

    private String audio;

    public Audio(FairytaleTTS fairytaleTTS, FairytalePageContent page, String audio) {
        this.fairytaleTTS = fairytaleTTS;
        this.page = page;
        this.audio = audio;
    }

    public static Audio of(FairytaleTTS fairytaleTTS, FairytalePageContent page, String audio) {
        return new Audio(fairytaleTTS, page, audio);
    }
}
