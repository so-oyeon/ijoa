package com.checkitout.ijoa.TTS.domain;

import com.checkitout.ijoa.TTS.dto.request.TTSProfileRequestDto;
import com.checkitout.ijoa.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class TTS {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TTS_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    private String TTS;

    private String image;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public TTS(User user, String name, String tts, String image, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.user = user;
        this.name = name;
        this.TTS = tts;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TTS of(User user, String name, String tts, String image, LocalDateTime createdAt, LocalDateTime updatedAt) {
        return new TTS(user, name, tts, image, createdAt, updatedAt);
    }

}
