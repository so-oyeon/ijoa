package com.checkitout.ijoa.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;

    private String nickname;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean isDeactivated;

    public static User createUser(String email, String password, String nickname, LocalDateTime now) {
        User user = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        user.createdAt = now;
        user.updatedAt = now;
        user.isDeactivated = false;
        return user;
    }
}
