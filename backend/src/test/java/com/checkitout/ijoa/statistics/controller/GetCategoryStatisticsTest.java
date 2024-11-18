package com.checkitout.ijoa.statistics.controller;

import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_BELONG_TO_PARENT;
import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_FOUND;
import static com.checkitout.ijoa.fairytale.domain.CATEGORY.ART_EXPERIENCE;
import static com.checkitout.ijoa.fairytale.domain.CATEGORY.COMMUNICATION;
import static com.checkitout.ijoa.fairytale.domain.CATEGORY.NATURE_EXPLORATION;
import static com.checkitout.ijoa.user.domain.User.createUser;
import static java.time.LocalDateTime.now;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.domain.Enum.Gender;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.util.SecurityTestUtil;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("분류별 독서 통계 조회 테스트")
public class GetCategoryStatisticsTest {

    protected MockMvc mockMvc;
    private final WebApplicationContext context;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final FairytaleRepository fairytaleRepository;
    private final ChildReadBooksRepository childReadBooksRepository;

    private static final String BASE_URL = "/children/{childId}/statistics/categories";
    private static final Integer total = 3;
    private static final CATEGORY[] category = {COMMUNICATION, ART_EXPERIENCE, NATURE_EXPLORATION};
    private static final Integer[] categoryCounts = {10, 5, 3};

    private User user;
    private Child child;

    @Autowired
    public GetCategoryStatisticsTest(MockMvc mockMvc, WebApplicationContext context, UserRepository userRepository,
                                     ChildRepository childRepository, FairytaleRepository fairytaleRepository,
                                     ChildReadBooksRepository childReadBooksRepository) {
        this.mockMvc = mockMvc;
        this.context = context;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.fairytaleRepository = fairytaleRepository;
        this.childReadBooksRepository = childReadBooksRepository;
    }

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).alwaysDo(print()).build();

        user = createUser("test@test.com", "password", "test", now());
        userRepository.save(user);

        child = Child.createChild(user, "testChild", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(child);

        Fairytale[] fairytales = new Fairytale[total];
        for (int i = 0; i < total; i++) {
            Fairytale fairytale = Fairytale.of("테스트 동화", "작가", "그림 작가", "1234", "", 2024, "아이조아", category[i],
                    0);
            fairytaleRepository.save(fairytale);

            fairytales[i] = fairytale;
        }

        for (int i = 0; i < total; i++) {
            ChildReadBooks childReadBook = ChildReadBooks.of(null, null, true, child, fairytales[i], categoryCounts[i]);
            childReadBooksRepository.save(childReadBook);
        }
    }

    @Test
    @DisplayName("[OK] getCategoryStatistics : 분류별 독서 통계 조회 성공")
    void getCategoryStatistics_Success() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), null);

        Long childId = child.getId();

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL, childId));

        // then
        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$.length()").value(total));
        for (int i = 0; i < total; i++) {
            result.andExpect(jsonPath("$.[" + i + "].category").value(category[i].getDisplayName()))
                    .andExpect(jsonPath("$.[" + i + "].count").value(categoryCounts[i]));
        }
    }

    @Test
    @DisplayName("[NoContent] getCategoryStatistics : 분류별 독서 통계 조회 성공 - 독서 기록이 없는 경우")
    void getCategoryStatistics_Success_NoContent() throws Exception {
        // given
        Child newChild = Child.createChild(user, "newChild", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(newChild);

        SecurityTestUtil.setUpSecurityContext(user.getId(), null);

        Long childId = newChild.getId();

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL, childId));

        // then
        result.andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("[NotFound] getCategoryStatistics : 존재하지 않는 아이 ID로 인한 실패")
    void getCategoryStatistics_Fail_ChildNotFound() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), null);

        Long nonExistentChildId = 999L;

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL, nonExistentChildId));

        // then
        result.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(CHILD_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(CHILD_NOT_FOUND.getMessage()));
    }

    @Test
    @DisplayName("[Unauthorized] getCategoryStatistics : 인증되지 않은 사용자 접근으로 인한 실패")
    void getCategoryStatistics_Fail_Unauthorized() throws Exception {
        // given
        Long childId = child.getId();

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL, childId));

        // then
        result.andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("[Forbidden] getCategoryStatistics : 부모 ID와 연결되지 않은 아이 조회로 인한 실패")
    void getCategoryStatistics_Fail_Forbidden() throws Exception {
        // given
        User otherUser = User.createUser("test2@test.com", "password", "test", now());
        userRepository.save(otherUser);

        Child otherChild = Child.createChild(otherUser, "otherChild", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(otherChild);

        SecurityTestUtil.setUpSecurityContext(user.getId(), null);

        Long childId = otherChild.getId();

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL, childId));

        // then
        result.andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(CHILD_NOT_BELONG_TO_PARENT.getCode()))
                .andExpect(jsonPath("$.message").value(CHILD_NOT_BELONG_TO_PARENT.getMessage()));
    }
}