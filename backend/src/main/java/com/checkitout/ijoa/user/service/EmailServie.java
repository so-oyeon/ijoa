package com.checkitout.ijoa.user.service;

import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailServie {

    private static final String EMAIL_SUBJECT_VERIFICATION = "아이조아 이메일 인증번호";
    private static final String EMAIL_CONTENT_VERIFICATION = "아이조아를 방문해주셔서 감사합니다😊<br><br>인증 번호는 [ %s ] 입니다.<br>인증번호를 홈페이지에서 입력해주세요😊";
    private static final String EMAIL_SUBJECT_PASSWORD_RESET = "아이조아 비밀번호 초기화 안내";
    private static final String EMAIL_CONTENT_PASSWORD_RESET = "아이조아 회원님의 초기화된 비밀번호는<br>[ %s ] 입니다.<br>로그인 후 반드시 비밀번호를 변경해 주세요😊";
    private static final String EMAIL_SUBJECT_COMPLETE_TTS="아이조아 TTS 생성 완료 알림";
    private static final String EMAIL_CONTENT_COMPLETE_TTS="회원님의 목소리를 학습한 TTS가 생성되었습니다. <br> 지금 <strong><a href='https://ijoaa.com'>아이조아</a></strong> 에서 확인해보세요😊";
    private final JavaMailSender mailSender;


    @Value("${spring.mail.username}")
    private String SENDER_EMAIL;

    /**
     * 이메일 전송
     */
    private void sendEmail(String email, String subject, String content) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;

        try {
            helper = new MimeMessageHelper(message, true, "utf-8");
            helper.setFrom(SENDER_EMAIL);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new CustomException(ErrorCode.EMAIL_VERIFICATION_SEND_FAILED);
        }
    }

    /**
     * 이메일 인증번호 전송
     */
    public String sendVerificationEmail(String email) {
        String authCode = generateVerificationCode();
        String content = String.format(EMAIL_CONTENT_VERIFICATION, authCode);
        sendEmail(email, EMAIL_SUBJECT_VERIFICATION, content);
        return authCode;
    }

    /**
     * 비밀번호 초기화 이메일 전송
     */
    public void sendPasswordResetEmail(String email, String newPassword) {
        String content = String.format(EMAIL_CONTENT_PASSWORD_RESET, newPassword);
        sendEmail(email, EMAIL_SUBJECT_PASSWORD_RESET, content);
    }

    public void sendCompleteEmail(String email){
        sendEmail(email, EMAIL_SUBJECT_COMPLETE_TTS, EMAIL_CONTENT_COMPLETE_TTS);

    }

    /**
     * 인증번호 생성
     */
    public String generateVerificationCode() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(3);

            switch (index) {
                case 0 -> key.append((char) (random.nextInt(26) + 65));
                case 1 -> key.append((char) (random.nextInt(26) + 97));
                case 2 -> key.append(random.nextInt(10));
            }
        }
        return key.toString();
    }
}
