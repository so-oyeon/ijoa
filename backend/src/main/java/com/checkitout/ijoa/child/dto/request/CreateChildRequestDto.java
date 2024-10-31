package com.checkitout.ijoa.child.dto.request;

import com.checkitout.ijoa.child.domain.Enum.Gender;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateChildRequestDto {

    @NotBlank(message = "이름은 필수 항목입니다.")
    @Schema(description = "자녀 이름", example = "이다솔")
    private String name;

    @NotNull
    @Past(message = "생년월일은 오늘보다 이전이어야 합니다.")
    @Schema(description = "자녀 생일", example = "2018-01-01")
    private LocalDate birth;

    @NotNull
    @Schema(description = "자녀 성별(MALE, FEMALE)", example = "FEMALE")
    private Gender gender;


    @Parameter(description = "사용자의 프로필 이미지 파일", schema = @Schema(type = "string", format = "binary"))
    private MultipartFile profileImg;
}
