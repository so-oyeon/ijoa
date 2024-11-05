package com.checkitout.ijoa.quiz.service;

import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.quiz.dto.request.ChatGPTRequest;
import com.checkitout.ijoa.quiz.dto.request.ChatGPTResponse;
import com.checkitout.ijoa.quiz.dto.response.QuizResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final RestTemplate template;
    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURL;

    public QuizResponseDto fairytaleQuiz(Long pageId) {
        // db질문 조회

        // 없으면
        //질문
        String prompt = "fairytale";
        ChatGPTRequest request = new ChatGPTRequest(model,prompt);
        ChatGPTResponse response = template.postForObject(apiURL, request, ChatGPTResponse.class);
        if(response == null) {
            throw new CustomException(ErrorCode.QUIZ_NOT_FOUND);
        }
        String question =  response.getChoices().get(0).getMessage().getContent();

        // db 저장

        return QuizResponseDto.of( pageId,question);
    }
}
