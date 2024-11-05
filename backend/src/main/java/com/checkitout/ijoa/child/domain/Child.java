package com.checkitout.ijoa.child.domain;

import com.checkitout.ijoa.child.domain.Enum.Gender;
import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.PageHistory;
import com.checkitout.ijoa.user.domain.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Child {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "child_id")
    private Long id;

    private String name;

    private String profile;

    private LocalDate birth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean isDeleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User parent;

    @OneToMany(mappedBy = "child", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PageHistory> pageHistories = new ArrayList<>();

    @OneToMany(mappedBy = "child", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChildReadBooks> childReadBooks = new ArrayList<>();

    public static Child createChild(User parent, String name, String profile, LocalDate birth, Gender gender,
                                    LocalDateTime now) {
        Child child = new Child();
        child.parent = parent;
        child.name = name;
        child.profile = profile;
        child.birth = birth;
        child.gender = gender;
        child.createdAt = now;
        child.updatedAt = now;
        child.isDeleted = false;
        return child;
    }
}