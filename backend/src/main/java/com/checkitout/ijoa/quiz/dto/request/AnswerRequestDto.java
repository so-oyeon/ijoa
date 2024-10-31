package com.checkitout.ijoa.quiz.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
public class AnswerRequestDto {

    @NotBlank(message = "childId 은 필수 항목입니다.")
    @Schema(description = "자녀 아이디", example = "24312")
    private Long childId;

    @NotBlank(message = "quizId 은 필수 항목입니다.")
    @Schema(description = "질문 아이디", example = "24312")
    private Long quizId;


    @NotBlank(message = "파일 타입은 필수 항목입니다.")
    @Schema(description = "파일 타입", example = "wav")
    private Long fileType;

    @Builder
    public AnswerRequestDto(Long childId, Long quizId, Long fileType) {
        this.childId = childId;
        this.quizId = quizId;
        this.fileType = fileType;
    }
}
