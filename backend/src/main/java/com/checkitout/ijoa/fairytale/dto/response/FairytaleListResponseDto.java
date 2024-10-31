package com.checkitout.ijoa.fairytale.dto.response;

import com.checkitout.ijoa.child.domain.Enum.Gender;
import lombok.Builder;
import lombok.Data;

@Data
public class FairytaleListResponseDto {

    private long fairytaleId;

    private String title;

    private String image;

    private int total_pages;

    private boolean is_completed;

    private int current_page;

    @Builder
    public FairytaleListResponseDto(long fairytaleId, String title, String image, int total_pages, boolean is_completed, int current_page) {
        this.fairytaleId = fairytaleId;
        this.title = title;
        this.image = image;
        this.total_pages = total_pages;
        this.is_completed = is_completed;
        this.current_page = current_page;
    }
}
