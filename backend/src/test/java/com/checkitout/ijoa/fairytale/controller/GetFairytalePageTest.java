package com.checkitout.ijoa.fairytale.controller;


import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_PAGE_NOT_FOUND;
import static com.checkitout.ijoa.fairytale.domain.CATEGORY.COMMUNICATION;
import static java.time.LocalDateTime.now;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.domain.Enum.Gender;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.domain.FairytalePageImage;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytalePageImageRepository;
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
@DisplayName("동화책 특정 페이지 조회 테스트")
class GetFairytalePageTest {

    protected MockMvc mockMvc;
    private final WebApplicationContext context;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;
    private final FairytalePageImageRepository fairytalePageImageRepository;

    private static final String BASE_URL = "/fairytales/{fairytaleId}/pages/{pageNumber}";

    private Fairytale fairytale;
    private FairytalePageContent fairytalePageContent;
    private User user;
    private Child child;

    @Autowired
    public GetFairytalePageTest(MockMvc mockMvc, WebApplicationContext context, UserRepository userRepository,
                                ChildRepository childRepository, FairytaleRepository fairytaleRepository,
                                FairytalePageImageRepository fairytalePageImageRepository,
                                FairytalePageContentRepository fairytalePageContentRepository) {
        this.mockMvc = mockMvc;
        this.context = context;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.fairytaleRepository = fairytaleRepository;
        this.fairytalePageImageRepository = fairytalePageImageRepository;
        this.fairytalePageContentRepository = fairytalePageContentRepository;
    }

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();

        user = User.createUser("test@test.com", "password", "test", now());
        userRepository.save(user);

        child = Child.createChild(user, "testChild", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(child);

        fairytale = Fairytale.of("테스트 동화", "작가", "그림 작가", "1234", "", 2024, "아이조아", COMMUNICATION,
                1);
        fairytaleRepository.save(fairytale);

        FairytalePageImage fairytalePageImage = FairytalePageImage.of("https://test-image.com", fairytale);
        fairytalePageImageRepository.save(fairytalePageImage);

        fairytalePageContent = FairytalePageContent.of(1, "테스트 내용입니다.", 1, 2, fairytalePageImage,
                fairytale);
        fairytalePageContentRepository.save(fairytalePageContent);
    }

    @Test
    @DisplayName("[Created] getFairytalePage : 동화책 특정 페이지 조회 성공")
    void getFairytalePage_Success() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());

        Long fairytaleId = fairytale.getId();
        Integer pageNumber = fairytalePageContent.getPageNumber();

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, fairytaleId, pageNumber));

        // then
        result.andExpect(status().isCreated())
                .andExpect(jsonPath("$.pageNumber").value(pageNumber))
                .andExpect(jsonPath("$.content").value(fairytalePageContent.getContent()))
                .andExpect(jsonPath("$.image").value(fairytalePageContent.getFairytalePageImage().getImageUrl()))
                .andExpect(jsonPath("$.totalPages").value(fairytale.getTotalPages()))
                .andExpect(jsonPath("$.pageHistoryId").exists())
                .andDo(print());
    }

    @Test
    @DisplayName("[NotFound] getFairytalePage : 존재하지 않는 동화책 조회로 인한 실패")
    void getFairytalePage_Fail_FairytaleNotFound() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());

        Long nonExistentFairytaleId = 999L;
        Integer pageNumber = 1;

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, nonExistentFairytaleId, pageNumber));

        // then
        result.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(FAIRYTALE_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(FAIRYTALE_NOT_FOUND.getMessage()));
    }

    @Test
    @DisplayName("[NotFound] getFairytalePage : 존재하지 않는 페이지 번호 조회로 인한 실패")
    void getFairytalePage_Fail_PageNotFound() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());

        Long fairytaleId = fairytale.getId();
        Integer nonExistentPageNumber = 999;

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, fairytaleId, nonExistentPageNumber));

        // then
        result.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(FAIRYTALE_PAGE_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(FAIRYTALE_PAGE_NOT_FOUND.getMessage()));
    }

    @Test
    @DisplayName("[Unauthorized] getFairytalePage : 인증되지 않은 사용자 접근으로 인한 실패")
    void getFairytalePage_Fail_Unauthorized() throws Exception {
        // given
        Long fairytaleId = 1L;
        Integer pageNumber = 1;

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, fairytaleId, pageNumber));

        // then
        result.andExpect(status().isUnauthorized())
                .andDo(print());
    }


    @Test
    @DisplayName("[NotFound] getFairytalePage : 자녀가 인증되지 않은 사용자 접근으로 인한 실패")
    void getFairytalePage_Fail_Unauthorized2() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), null);

        Long fairytaleId = 1L;
        Integer pageNumber = 1;

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, fairytaleId, pageNumber));

        // then
        result.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(CHILD_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(CHILD_NOT_FOUND.getMessage()));
    }
}