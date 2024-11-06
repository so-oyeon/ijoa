package com.checkitout.ijoa.TTS.dto.request;

import com.checkitout.ijoa.TTS.domain.TTS;
import com.checkitout.ijoa.child.domain.Enum.Gender;
import com.checkitout.ijoa.user.domain.User;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TTSProfileRequestDto {

    @NotBlank(message = "이름은 필수 항목입니다.")
    @Size(min = 1, max = 20, message = "이름은 1자에서 20자 사이여야 합니다.")
    @Schema(description = "TTS 이름", example = "엄마")
    private String name;

    @Parameter(description = "사용자의 프로필 이미지 파일", schema = @Schema(type = "string", format = "binary"))
    private MultipartFile image;

    public static TTS of(TTSProfileRequestDto request,String url,  User user){
        TTS tts = TTS.of(user, request.getName(), null, url, LocalDateTime.now(),LocalDateTime.now());
        return tts;
    }
}
