package com.checkitout.ijoa.fairytale.domain;

import lombok.Getter;

@Getter
public enum CATEGORY {
    COMMUNICATION("의사소통"),
    NATURE_EXPLORATION("자연탐구"),
    SOCIAL_RELATIONSHIPS("사회관계"),
    ART_EXPERIENCE("예술경험"),
    PHYSICAL_ACTIVITY_HEALTH("신체운동/건강");

    private final String displayName;

    CATEGORY(String displayName) {
        this.displayName = displayName;
    }
}
