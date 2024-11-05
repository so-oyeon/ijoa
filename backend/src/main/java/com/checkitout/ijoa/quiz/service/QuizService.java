package com.checkitout.ijoa.quiz.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.file.service.FileService;
import com.checkitout.ijoa.quiz.domain.Answer;
import com.checkitout.ijoa.quiz.domain.Quiz;
import com.checkitout.ijoa.quiz.dto.request.AnswerRequestDto;
import com.checkitout.ijoa.quiz.dto.request.ChatGPTRequest;
import com.checkitout.ijoa.quiz.dto.request.ChatGPTResponse;
import com.checkitout.ijoa.quiz.dto.response.AnswerUrlResponseDto;
import com.checkitout.ijoa.quiz.dto.response.QuizResponseDto;
import com.checkitout.ijoa.quiz.repository.AnswerRepository;
import com.checkitout.ijoa.quiz.repository.QuizRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {

    private final RestTemplate template;
    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURL;

    private final QuizRepository quizRepository;
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;
    private final AnswerRepository answerRepository;

    private final FileService fileService;

    private final SecurityUtil securityUtil;


    public QuizResponseDto fairytaleQuiz(Long bookId, Integer pageNum) {
        // db질문 조회
        Fairytale fairytale = fairytaleRepository.findById(bookId).orElseThrow(() -> new CustomException(ErrorCode.FAIRYTALE_NOT_FOUND));
        Quiz quiz = quizRepository.findByFairytaleAndPagePageNumber(fairytale, pageNum);
        if(quiz!=null){
            return QuizResponseDto.of(quiz.getId(),quiz.getQuestion());
        }
        // 없으면
        FairytalePageContent pageContent = fairytalePageContentRepository.findByFairytaleAndPageNumber(fairytale,pageNum)
                .orElseThrow(() -> new CustomException(ErrorCode.FAIRYTALE_PAGE_NOT_FOUND));

        String prompt = pageContent.getContent()+"이 내용으로 4~7세 유아에게 독서 흥미를 높여주는 질문을 하나만 만들어줘. 예를 들어,'토끼가 지금 배고프대! 너는 오늘 뭘 먹었어?' 처럼 해줘.";
        ChatGPTRequest request = new ChatGPTRequest(model,prompt);
        ChatGPTResponse response = template.postForObject(apiURL, request, ChatGPTResponse.class);
        if(response == null) {
            throw new CustomException(ErrorCode.QUIZ_NOT_FOUND);
        }
        String question =  response.getChoices().get(0).getMessage().getContent();

        // db 저장
        Quiz newQuiz = Quiz.of(fairytale,pageContent,question);
        newQuiz =quizRepository.save(newQuiz);

        return QuizResponseDto.of( newQuiz.getId(),question);
    }

    public AnswerUrlResponseDto getAnswerUrl(AnswerRequestDto requestDto) {
        String key = "anwer/" + requestDto.getChildId() + "/" + UUID.randomUUID() + "/" + requestDto.getFileName();

        //url 발급
        String url = fileService.getPostS3Url(key);
        Quiz quiz = quizRepository.findById(requestDto.getQuizId()).orElseThrow(() -> new CustomException(ErrorCode.QUIZ_NOT_FOUND));
        Child child = securityUtil.getChildByToken();

        Answer answer = Answer.of(key,child,quiz);

        answer =answerRepository.save(answer);

        return AnswerUrlResponseDto.builder().answerId(answer.getId()).answerUrl(url).build();

    }
}
