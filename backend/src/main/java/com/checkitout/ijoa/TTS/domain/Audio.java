package com.checkitout.ijoa.TTS.domain;

import com.checkitout.ijoa.fairytale.domain.FairytalePage;
import com.checkitout.ijoa.user.domain.User;
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
    @JoinColumn(name = "TTS_id")
    private TTS tts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fairytale_page_id")
    private FairytalePage page;

    private String audio;

}
