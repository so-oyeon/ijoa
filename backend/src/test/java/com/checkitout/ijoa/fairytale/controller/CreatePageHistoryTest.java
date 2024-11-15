package com.checkitout.ijoa.fairytale.controller;

import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.PAGE_HISTORY_ACCESS_DENIED;
import static com.checkitout.ijoa.exception.ErrorCode.PAGE_HISTORY_NOT_FOUND;
import static com.checkitout.ijoa.fairytale.domain.CATEGORY.COMMUNICATION;
import static java.time.LocalDateTime.now;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.domain.Enum.Gender;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.domain.FairytalePageImage;
import com.checkitout.ijoa.fairytale.domain.PageHistory;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationRequest;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytalePageImageRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.fairytale.repository.PageHistoryRepository;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.util.SecurityTestUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("동화책 특정 페이지 시선추적 데이터 저장 테스트")
public class CreatePageHistoryTest {

    protected MockMvc mockMvc;
    protected ObjectMapper objectMapper;
    private final WebApplicationContext context;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;
    private final FairytalePageImageRepository fairytalePageImageRepository;
    private final PageHistoryRepository pageHistoryRepository;

    private static final String BASE_URL = "/fairytales/reading-histories/{pageHistoryId}/eye-tracking";

    private User user;
    private Child child;
    private PageHistory pageHistory;

    @Autowired
    public CreatePageHistoryTest(MockMvc mockMvc, ObjectMapper objectMapper, WebApplicationContext context,
                                 UserRepository userRepository, ChildRepository childRepository,
                                 FairytaleRepository fairytaleRepository,
                                 FairytalePageImageRepository fairytalePageImageRepository,
                                 FairytalePageContentRepository fairytalePageContentRepository,
                                 PageHistoryRepository pageHistoryRepository) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.context = context;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.fairytaleRepository = fairytaleRepository;
        this.fairytalePageImageRepository = fairytalePageImageRepository;
        this.fairytalePageContentRepository = fairytalePageContentRepository;
        this.pageHistoryRepository = pageHistoryRepository;
    }

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();

        user = User.createUser("test@test.com", "password", "test", now());
        userRepository.save(user);

        child = Child.createChild(user, "testChild", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(child);

        Fairytale fairytale = Fairytale.of("테스트 동화", "작가", "그림 작가", "1234", "", 2024, "아이조아", COMMUNICATION,
                1);
        fairytaleRepository.save(fairytale);

        FairytalePageImage fairytalePageImage = FairytalePageImage.of("https://test-image.com", fairytale);
        fairytalePageImageRepository.save(fairytalePageImage);

        FairytalePageContent fairytalePageContent = FairytalePageContent.of(1, "테스트 내용입니다.", 1, 2, fairytalePageImage,
                fairytale);
        fairytalePageContentRepository.save(fairytalePageContent);

        pageHistory = PageHistory.of(child, fairytalePageContent);
        pageHistoryRepository.save(pageHistory);
    }

    /**
     * testName, trackedAt, isGazeOutOfScreen, attentionRate, word, isImage
     */
    private static Stream<Arguments> validParameter() {
        return Stream.of(
                Arguments.of("글을 본 경우", now(), false, 1.0f, "사과", false),
                Arguments.of("그림을 본 경우", now(), false, 1.0f, null, true)
        );
    }

    /**
     * testName, trackedAt, isGazeOutOfScreen, attentionRate, word, isImage
     */
    private static Stream<Arguments> invalidParameter() {
        return Stream.of(
                Arguments.of("시선추적 시간이 null인 경우", null, false, 1.0f, "사과", false),
                Arguments.of("화면 밖 응시 여부가 null인 경우", now(), null, 1.0f, "사과", false),
                Arguments.of("그림 여부가 null인 경우", now(), false, 1.0f, "사과", null),

                Arguments.of("시선추적 시간이 미래인 경우", now().plusMinutes(1), false, 1.0f, "사과", false)
        );
    }

    @ParameterizedTest(name = "{index}: {0}")
    @MethodSource("validParameter")
    @DisplayName("[Created] createPageHistory : 동화책 특정 페이지 시선추적 데이터 저장 성공")
    void createPageHistory_Success(String testName, LocalDateTime trackedAt, Boolean isGazeOutOfScreen,
                                   Float attentionRate, String word, Boolean isImage) throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());
        PageHistoryCreationRequest pageHistoryCreationRequest = new PageHistoryCreationRequest(trackedAt,
                isGazeOutOfScreen, attentionRate, word, isImage);
        String requestBody = objectMapper.writeValueAsString(pageHistoryCreationRequest);

        Long pageHistoryId = pageHistory.getId();

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, pageHistoryId)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(requestBody));

        // then
        result.andExpect(status().isCreated());
    }

    @ParameterizedTest(name = "{index}: {0}")
    @MethodSource("invalidParameter")
    @DisplayName("[BadRequest] createPageHistory : 동화책 특정 페이지 시선추적 데이터 저장 성공")
    void createPageHistory_Fail_BadRequest(String testName, LocalDateTime trackedAt, Boolean isGazeOutOfScreen,
                                           Float attentionRate, String word, Boolean isImage) throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());
        PageHistoryCreationRequest pageHistoryCreationRequest = new PageHistoryCreationRequest(trackedAt,
                isGazeOutOfScreen, attentionRate, word, isImage);
        String requestBody = objectMapper.writeValueAsString(pageHistoryCreationRequest);

        Long pageHistoryId = pageHistory.getId();

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, pageHistoryId)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(requestBody));

        // then
        result.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("[NotFound] createPageHistory : 존재하지 않는 페이지 기록 조회로 인한 실패")
    void createPageHistory_Fail_FairytaleNotFound() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());
        PageHistoryCreationRequest pageHistoryCreationRequest = new PageHistoryCreationRequest(now(), false, 1.0f, "사과",
                false);
        String requestBody = objectMapper.writeValueAsString(pageHistoryCreationRequest);

        Long nonExistentPageHistoryId = 999L;

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, nonExistentPageHistoryId)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(requestBody));

        // then
        result.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(PAGE_HISTORY_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(PAGE_HISTORY_NOT_FOUND.getMessage()));
    }

    @Test
    @DisplayName("[Unauthorized] createPageHistory : 인증되지 않은 사용자 접근으로 인한 실패")
    void createPageHistory_Fail_Unauthorized() throws Exception {
        // given
        Long pageHistoryId = pageHistory.getId();

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, pageHistoryId));

        // then
        result.andExpect(status().isUnauthorized());
    }


    @Test
    @DisplayName("[NotFound] createPageHistory : 아이가 인증되지 않은 사용자 접근으로 인한 실패")
    void createPageHistory_Fail_Unauthorized2() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), null);
        PageHistoryCreationRequest pageHistoryCreationRequest = new PageHistoryCreationRequest(now(), false, 1.0f, "사과",
                false);
        String requestBody = objectMapper.writeValueAsString(pageHistoryCreationRequest);

        Long pageHistoryId = pageHistory.getId();

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, pageHistoryId)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(requestBody));

        // then
        result.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(CHILD_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(CHILD_NOT_FOUND.getMessage()));
    }

    @Test
    @DisplayName("[Forbidden] createPageHistory : 페이지 기록 ID와 연결되지 않은 아이로 인증한 사용자 접근으로 인한 실패")
    void createPageHistory_Fail_Forbidden() throws Exception {
        // given
        Child child = Child.createChild(user, "testChild2", "", LocalDate.now(), Gender.MALE, now());
        childRepository.save(child);
        SecurityTestUtil.setUpSecurityContext(user.getId(), child.getId());
        PageHistoryCreationRequest pageHistoryCreationRequest = new PageHistoryCreationRequest(now(), false, 1.0f, "사과",
                false);
        String requestBody = objectMapper.writeValueAsString(pageHistoryCreationRequest);

        Long pageHistoryId = pageHistory.getId();

        // when
        ResultActions result = mockMvc.perform(post(BASE_URL, pageHistoryId)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(requestBody));

        // then
        result.andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(PAGE_HISTORY_ACCESS_DENIED.getCode()))
                .andExpect(jsonPath("$.message").value(PAGE_HISTORY_ACCESS_DENIED.getMessage()));
    }
}