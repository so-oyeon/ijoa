package com.checkitout.ijoa.child.dto.response;

import com.checkitout.ijoa.child.domain.Enum.Gender;
import lombok.Data;

@Data
public class CreateChildResponseDto {

    private long childId;

    private String name;

    private Gender gender;

    private String birth;

    private String profileUrl;
}
