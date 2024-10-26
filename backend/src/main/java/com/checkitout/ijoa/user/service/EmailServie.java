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

    private static final String EMAIL_SUBJECT = "아이조아 이메일 인증번호";
    private static final String EMAIL_CONTENT = "아이조아를 방문해주셔서 감사합니다😊<br><br>인증 번호는 [ %s ] 입니다.<br>인증번호를 홈페이지에서 입력해주세요😊";

    private final JavaMailSender mailSender;


    @Value("${spring.mail.username}")
    private String SENDER_EMAIL;

    public String sendEmail(String email) {

        String code = generateVerificationCode();

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = null;

        try {

            helper = new MimeMessageHelper(message, true, "utf-8");
            helper.setFrom(SENDER_EMAIL);
            helper.setTo(email);
            helper.setSubject(EMAIL_SUBJECT);
            helper.setText(String.format(EMAIL_CONTENT, code), true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new CustomException(ErrorCode.EMAIL_VERIFICATION_SEND_FAILED);
        }

        return code;
    }

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
