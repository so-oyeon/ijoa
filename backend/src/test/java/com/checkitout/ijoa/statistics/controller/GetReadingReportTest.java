package com.checkitout.ijoa.statistics.controller;

import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_BELONG_TO_PARENT;
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
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.domain.FairytalePageImage;
import com.checkitout.ijoa.fairytale.domain.PageHistory;
import com.checkitout.ijoa.fairytale.repository.EyeTrackingDataRepository;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytalePageImageRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.fairytale.repository.PageHistoryRepository;
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
@DisplayName("독서 분석 보고서 조회 테스트")
public class GetReadingReportTest {

    protected MockMvc mockMvc;
    private final WebApplicationContext context;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;
    private final FairytalePageImageRepository fairytalePageImageRepository;
    private final PageHistoryRepository pageHistoryRepository;
    private final EyeTrackingDataRepository eyeTrackingDataRepository;

    private static final String BASE_URL = "/children/{childId}/statistics/reading-report";

    private User user;
    private Child child;

    @Autowired
    public GetReadingReportTest(MockMvc mockMvc, WebApplicationContext context, UserRepository userRepository,
                                ChildRepository childRepository, FairytaleRepository fairytaleRepository,
                                FairytalePageImageRepository fairytalePageImageRepository,
                                FairytalePageContentRepository fairytalePageContentRepository,
                                PageHistoryRepository pageHistoryRepository,
                                EyeTrackingDataRepository eyeTrackingDataRepository) {
        this.mockMvc = mockMvc;
        this.context = context;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.fairytaleRepository = fairytaleRepository;
        this.fairytalePageImageRepository = fairytalePageImageRepository;
        this.fairytalePageContentRepository = fairytalePageContentRepository;
        this.pageHistoryRepository = pageHistoryRepository;
        this.eyeTrackingDataRepository = eyeTrackingDataRepository;
    }

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).alwaysDo(print()).build();

        user = createUser("test@test.com", "password", "test", now());
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

        PageHistory pageHistory = PageHistory.of(child, fairytalePageContent);
        pageHistoryRepository.save(pageHistory);

        EyeTrackingData eyeTrackingData = EyeTrackingData.of(now(), false, 1.0f, "사과", false, pageHistory);
        eyeTrackingDataRepository.save(eyeTrackingData);

        EyeTrackingData eyeTrackingData2 = EyeTrackingData.of(now().minusDays(1), true, null, null, false, pageHistory);
        eyeTrackingDataRepository.save(eyeTrackingData2);

        EyeTrackingData eyeTrackingData3 = EyeTrackingData.of(now().minusHours(1), true, null, null, false,
                pageHistory);
        eyeTrackingDataRepository.save(eyeTrackingData3);

        EyeTrackingData eyeTrackingData4 = EyeTrackingData.of(now().plusHours(3), false, 1.0f, "사과", false,
                pageHistory);
        eyeTrackingDataRepository.save(eyeTrackingData4);
    }

    @Test
    @DisplayName("[OK] getReadingReport : 독서 분석 보고서 조회 성공")
    void getReadingReport_Success() throws Exception {
        // given
        SecurityTestUtil.setUpSecurityContext(user.getId(), null);

        Long childId = child.getId();

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL, childId));

        // then
        result.andExpect(status().isOk());
    }

    @Test
    @DisplayName("[NoContent] getReadingReport : 독서 분석 보고서 조회 성공 - 데이터가 없는 경우")
    void getReadingReport_Success_NoContent() throws Exception {
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
    @DisplayName("[NotFound] getReadingReport : 존재하지 않는 아이 ID로 인한 실패")
    void getReadingReport_Fail_ChildNotFound() throws Exception {
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
    @DisplayName("[Unauthorized] getReadingReport : 인증되지 않은 사용자 접근으로 인한 실패")
    void getReadingReport_Fail_Unauthorized() throws Exception {
        // given
        Long childId = child.getId();

        // when
        ResultActions result = mockMvc.perform(get(BASE_URL, childId));

        // then
        result.andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("[Forbidden] getReadingReport : 부모 ID와 연결되지 않은 아이 조회로 인한 실패")
    void getReadingReport_Fail_Forbidden() throws Exception {
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