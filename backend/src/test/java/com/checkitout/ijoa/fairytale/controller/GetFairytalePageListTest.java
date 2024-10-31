package com.checkitout.ijoa.fairytale.controller;

import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_NOT_FOUND;
import static com.checkitout.ijoa.fairytale.domain.CATEGORY.COMMUNICATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.checkitout.ijoa.BackendApplication;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePage;
import com.checkitout.ijoa.fairytale.repository.FairytalePageRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@ContextConfiguration(classes = BackendApplication.class)
@AutoConfigureMockMvc
@Transactional
@DisplayName("동화책 페이지 목록 조회 테스트")
public class GetFairytalePageListTest {

    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageRepository fairytalePageRepository;
    private final WebApplicationContext context;
    protected MockMvc mockMvc;
    protected ObjectMapper objectMapper;
    private final EntityManager entityManager;

    private static final String BASE_URL = "/fairytales/{fairytaleId}/pages";
    private static final int TOTAL_PAGES = 20;
    private static final long NONEXISTENT_FAIRYTALE_ID = 999L;

    @Autowired
    public GetFairytalePageListTest(MockMvc mockMvc, ObjectMapper objectMapper, WebApplicationContext context,
                                    FairytaleRepository fairytaleRepository,
                                    FairytalePageRepository fairytalePageRepository, EntityManager entityManager) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.context = context;
        this.fairytaleRepository = fairytaleRepository;
        this.fairytalePageRepository = fairytalePageRepository;
        this.entityManager = entityManager;
    }

    @BeforeEach
    public void mockMvcSetUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    @DisplayName("[OK] getFairytalePageList : 동화책 페이지 목록 조회 성공")
    public void getFairytalePageList_Success() throws Exception {
        // given
        Fairytale fairytale = Fairytale.of("테스트 동화", "작가", "그림 작가", "1234", "", 2024, "아이조아", COMMUNICATION,
                TOTAL_PAGES);
        fairytaleRepository.save(fairytale);

        List<FairytalePage> fairytalePages = new ArrayList<>();
        for (int i = 1; i <= TOTAL_PAGES; i++) {
            final Integer pageNumber = i;
            final String content = "Content" + i;
            final Integer sentenceCount = 1;
            final Integer wordCount = 1;
            final String imageUrl = "imageUrl" + i;
            fairytalePages.add(fairytalePageRepository.save(
                    FairytalePage.of(pageNumber, content, sentenceCount, wordCount, imageUrl, fairytale)));
        }

        entityManager.flush();
        entityManager.clear();

        // when
        ResultActions resultActions = mockMvc.perform(get(BASE_URL, fairytale.getId())).andDo(print());

        // then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.result.length()").value(TOTAL_PAGES));

        for (int i = 0; i < TOTAL_PAGES; i++) {
            FairytalePage page = fairytalePages.get(i);
            resultActions.andExpect(
                            jsonPath("$.result[" + i + "].pageNumber").value(page.getPageNumber()))
                    .andExpect(jsonPath("$.result[" + i + "].image").value(page.getImageUrl()));
        }
    }

    @DisplayName("[NotFound] getFairytalePageList : 존재하지 않는 동화책 조회로 인한 실패.")
    @Test
    public void getFairytalePageList_fail() throws Exception {

        // when
        ResultActions resultActions = mockMvc.perform(
                get(BASE_URL, NONEXISTENT_FAIRYTALE_ID).accept(MediaType.APPLICATION_JSON_VALUE));

        // then
        resultActions.andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(FAIRYTALE_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(FAIRYTALE_NOT_FOUND.getMessage()));
    }
}
