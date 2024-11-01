package com.checkitout.ijoa.auth.service;

import com.checkitout.ijoa.auth.domain.redis.RedisEmail;
import com.checkitout.ijoa.auth.dto.request.EmailVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.LoginRequestDto;
import com.checkitout.ijoa.auth.dto.request.PasswordVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.TokenReissueRequestDto;
import com.checkitout.ijoa.auth.dto.response.LoginResponseDto;
import com.checkitout.ijoa.auth.dto.response.TokenReissueResponseDto;
import com.checkitout.ijoa.auth.repository.redis.EmailRepository;
import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.user.service.EmailServie;
import com.checkitout.ijoa.util.PasswordEncoder;
import com.checkitout.ijoa.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final EmailServie emailServie;
    private final TokenService tokenService;

    private final EmailRepository emailRepository;
    private final UserRepository userRepository;

    private final SecurityUtil securityUtil;
    private final ChildRepository childRepository;

    /**
     * 이메일 인증코드 전송
     */
    @Transactional
    public ResponseDto sendEmailVerificationCode(String email) {

        String authCode = emailServie.sendVerificationEmail(email);
        emailRepository.save(new RedisEmail(email, authCode));

        return new ResponseDto();
    }

    /**
     * 이메일 인증코드 검증
     */
    @Transactional(readOnly = true)
    public ResponseDto confirmEmailVerificationCode(EmailVerificationRequestDto requestDto) {

        RedisEmail email = emailRepository.findById(requestDto.getEmail()).orElseThrow(
                () -> new CustomException(ErrorCode.EMAIL_VERIFICATION_NOT_FOUND)
        );

        if (requestDto.getAuthCode().equals(email.getAuthCode())) {
            return new ResponseDto();
        } else {
            throw new CustomException(ErrorCode.INVALID_EMAIL_VERIFICATION_CODE);
        }
    }

    /**
     * 로그인
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto requestDto) {

        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        validatePassword(user, requestDto.getPassword());

        LoginResponseDto response = tokenService.saveRefreshToken(user.getId());
        response.setNickname(user.getNickname());

        return response;
    }

    /**
     * accessToken 재발급
     */
    @Transactional
    public TokenReissueResponseDto reissueRefreshToken(TokenReissueRequestDto requestDto) {

        Long userId = tokenService.getUserIdFromRefreshToken(requestDto.getRefreshToken());
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Long childId = tokenService.getChildIdFromRefreshToken(requestDto.getRefreshToken());
        LoginResponseDto response;

        if (childId != null) {
            response = tokenService.saveRefreshToken(user.getId(), childId);
        } else {
            response = tokenService.saveRefreshToken(user.getId(), null);
        }

        return TokenReissueResponseDto.of(response);
    }

    /**
     * 비밀번호 검증 API용 메서드
     */
    public ResponseDto verifyPassword(PasswordVerificationRequestDto requestDto) {

        User user = securityUtil.getUserByToken();
        validatePassword(user, requestDto.getPassword());

        return new ResponseDto();
    }

    /**
     * 자녀 프로필 전환
     */
    public LoginResponseDto switchToChild(Long childId, HttpServletRequest request) {

        Long userId = securityUtil.getCurrentUserId();
        verifyChildParentRelationship(userId, childId);

        // 새로운 토큰 발급
        LoginResponseDto response = tokenService.switchToChild(userId, childId);
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND));
        response.setNickname(child.getName());
        response.setUserId(child.getId());

        // 시큐리티에 추가
        securityUtil.setAuthentication(userId, childId, request);

        return response;
    }

    /**
     * 로그아웃
     */
    public ResponseDto logout() {

        long userId = securityUtil.getCurrentUserId();
        tokenService.deleteRefreshToken(userId);
        return new ResponseDto();
    }

    /**
     * 비밀번호 검증 메서드
     */
    @Transactional(readOnly = true)
    public void validatePassword(User user, String password) {

        String email = user.getEmail();
        String encryptedPw = PasswordEncoder.encrypt(email, password);

        if (!user.getPassword().equals(encryptedPw)) {
            throw new CustomException(ErrorCode.PASSWORD_MISMATCH);
        }
    }

    /**
     * 자녀 검증 메서드
     */
    public void verifyChildParentRelationship(Long userId, Long childId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        boolean isChildValid = user.getChildren().stream()
                .anyMatch(child -> child.getId().equals(childId));

        if (!isChildValid) {
            throw new CustomException(ErrorCode.CHILD_NOT_BELONG_TO_PARENT);
        }
    }
}
