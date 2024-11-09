package com.checkitout.ijoa.fairytale.controller;

import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_FOUND;
import static com.checkitout.ijoa.fairytale.domain.CATEGORY.COMMUNICATION;
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
import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.util.SecurityTestUtil;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
@DisplayName("나이대 인기 도서 조회 테스트")
public class GetFairytaleRankTest {

    protected MockMvc mockMvc;
    private final WebApplicationContext context;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final FairytaleRepository fairytaleRepository;
    private final ChildReadBooksRepository childReadBooksRepository;

    @Value("${recommendation_count}")
    private Integer recommendationCount;

    private static final String BASE_URL = "/fairytales/rank";
    private static final Integer totalFairytale = 10;
    private static final Integer[] completionCount = {10, 9, 8, 7, 6, 5, 4, 3, 2, 1};

    private User user;
    private Child child;
    private List<Fairytale> fairytales = new ArrayList<>();


    @Autowired
    public GetFairytaleRankTest(MockMvc mockMvc, WebApplicationContext context, UserRepository userRepository,
                                ChildRepository childRepository, FairytaleRepository fairytaleRepository,
                                ChildReadBooksRepository childReadBooksRepositoryy) {
        this.mockMvc = mockMvc;
        this.context = context;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.fairytaleRepository = fairytaleRepository;
        this.childReadBooksRepository = childReadBooksRepositoryy;
    }

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).alwaysDo(print()).build();

        user = createUser("test@test.com", "password", "test", now());
        userRepository.save(user);

        child = Child.createChild(user, "testChild", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(child);

        Child newChild = Child.createChild(user, "newChild", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(newChild);

        for (int i = 0; i < totalFairytale; i++) {
            Fairytale fairytale = Fairytale.of("테스트 동화" + i, "작가", "그림 작가", "1234", "", 2024, "아이조아", COMMUNICATION,
                    1);
            fairytaleRepository.save(fairytale);
            fairytales.add(fairytale);

            ChildReadBooks childReadBook = ChildReadBooks.of(1, now(), true, newChild, fairytale, completionCount[i]);
            childReadBooksRepository.save(childReadBook);
        }
    }

    @Test
    @DisplayName("[OK] getFairytaleRank : 나이대 인기 도서 조회 성공")
    void getFairytaleRank_Success() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL));

        // then
        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$.length()").value(recommendationCount));
        for (int i = 0; i < recommendationCount; i++) {
            result.andExpect(jsonPath("$.[" + i + "].fairytaleId").value(fairytales.get(i).getId()))
                    .andExpect(jsonPath("$.[" + i + "].title").value(fairytales.get(i).getTitle()))
                    .andExpect(jsonPath("$.[" + i + "].image").value(fairytales.get(i).getImageUrl()))
                    .andExpect(jsonPath("$.[" + i + "].totalPages").value(fairytales.get(i).getTotalPages()))
                    .andExpect(jsonPath("$.[" + i + "].currentPage").value(0))
                    .andExpect(jsonPath("$.[" + i + "].isCompleted").value(false));
        }
    }

    @Test
    @DisplayName("[NotFound] getFairytaleRank : 존재하지 않는 아이 ID로 인한 실패")
    void getFairytaleRank_Fail_ChildNotFound() throws Exception {
        // given
        Long nonExistentChildId = 999L;
        SecurityTestUtil.setUpSecurityContext(user.getId(), nonExistentChildId);

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL));

        // then
        result.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(CHILD_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(CHILD_NOT_FOUND.getMessage()));
    }

    @Test
    @DisplayName("[Unauthorized] getFairytaleRank : 인증되지 않은 사용자 접근으로 인한 실패")
    void getFairytaleRank_Fail_Unauthorized() throws Exception {
        // given & when
        ResultActions result = mockMvc.perform(get(BASE_URL));

        // then
        result.andExpect(status().isUnauthorized());
    }
}