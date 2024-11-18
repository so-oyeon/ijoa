package com.checkitout.ijoa.child.dto.response;

import com.checkitout.ijoa.child.domain.Enum.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ChildDto {

    @Schema(description = "자녀 Id", example = "1")
    private long childId;

    @Schema(description = "자녀 이름", example = "이다솔")
    private String name;

    @Schema(description = "자녀 성별", example = "MALE")
    private Gender gender;

    @Schema(description = "자녀 생일", example = "2018-01-01")
    private String birth;
    
    @Schema(description = "자녀 만나이", example = "6")
    private int age;

    @Schema(description = "자녀 프로필 url", example = "https://checkitout-bucket.s3.ap-northeast-2.amazonaws.com/profile/50d87979-ccf5-495b-ac6b-62900d7c957e")
    private String profileUrl;
}
