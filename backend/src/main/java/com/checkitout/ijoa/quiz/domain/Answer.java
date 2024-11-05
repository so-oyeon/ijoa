package com.checkitout.ijoa.quiz.domain;

import com.checkitout.ijoa.TTS.domain.FairytaleTTS;
import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
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
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Child child;

    private String answer;

    private LocalDateTime createdAt;

    public Answer(String answer, Child child, Quiz quiz) {
        this.answer = answer;
        this.child = child;
        this.quiz = quiz;
    }

    public static Answer of(String answer, Child child, Quiz quiz) {
        return new Answer(answer, child, quiz);
    }
}
