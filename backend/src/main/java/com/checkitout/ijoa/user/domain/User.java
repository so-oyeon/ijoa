package com.checkitout.ijoa.user.domain;

import com.checkitout.ijoa.child.domain.Child;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor
@ToString
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

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Child> children;

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
