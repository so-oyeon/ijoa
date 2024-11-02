package com.checkitout.ijoa.TTS.domain;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
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
public class TrainAudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "train_audio_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TTS_id")
    private TTS tts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_id")
    private Script script;

    @Column(length = 512)
    private String file_path;

    public TrainAudio(TTS tts, Script script, String file_path) {
        this.tts = tts;
        this.script = script;
        this.file_path = file_path;
    }

    public static TrainAudio of (TTS tts, Script script, String file_path) {
        return new TrainAudio(tts, script, file_path);
    }
}
