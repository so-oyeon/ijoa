package com.checkitout.ijoa.file.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.util.LogUtil;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class FileService {

    private final static String PROFILE_DIR = "profile";
    private final AmazonS3Client s3Client;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /*
     * 프로필 이미지 저장
     */
    public String saveProfileImage(MultipartFile file) throws IOException {

        File uploadFile = convert(file).orElseThrow(
                () -> new CustomException(ErrorCode.FILE_CONVERSION_ERROR)
        );
        return upload(uploadFile, PROFILE_DIR);
    }

    // 로컬에 잠시 저장
    private Optional<File> convert(MultipartFile file) throws IOException {

        Path convertFilePath = Paths.get(System.getProperty("user.home"), PROFILE_DIR, file.getOriginalFilename());
        Files.createDirectories(convertFilePath.getParent());
        Files.write(convertFilePath, file.getBytes());
        return Optional.of(convertFilePath.toFile());
    }

    // S3 업로드 함수 호출 + 로컬에 저장한 파일 삭제
    // 형식 : dirName/UUID.jpg
    private String upload(File file, String dirName) {
        String fileName = String.format("%s/%s", dirName, UUID.randomUUID());
        String uploadUrl = putS3(file, fileName);
        removeNewFile(file);
        return uploadUrl;
    }

    // S3로 파일 업로드
    private String putS3(File file, String fileName) {
        s3Client.putObject(
                new PutObjectRequest(bucket, fileName, file)
        );
        return s3Client.getUrl(bucket, fileName).toString();
    }

    // 로컬에 저장한 파일 삭제
    private void removeNewFile(File file) {
        if (file.delete()) {
            LogUtil.info("File delete success");
            return;
        }
        LogUtil.error("File delete fail");
    }

    // post 용 url반환
    public String getPostS3Url(String key) {

        // url 유효기간 설정하기(1시간)
        Date expiration = getExpiration();

        // presigned url 생성하기
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                getPostGeneratePresignedUrlRequest(key, expiration);

        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);

        // return
        return url.toExternalForm();
    }

    // get용 url반환
    public String getGetS3Url(String key) {
        // url 유효기간 설정하기(1시간)
        Date expiration = getExpiration();

        // presigned url 생성하기
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                getGetGeneratePresignedUrlRequest(key, expiration);

        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);

        // return
        return url.toExternalForm();
    }

    /* post 용 URL 생성하는 메소드 */
    private GeneratePresignedUrlRequest getPostGeneratePresignedUrlRequest(String fileName, Date expiration) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest
                = new GeneratePresignedUrlRequest(bucket, fileName)
                .withMethod(HttpMethod.PUT)
                .withKey(fileName)
                .withExpiration(expiration);
        generatePresignedUrlRequest.addRequestParameter(
                Headers.S3_CANNED_ACL,
                CannedAccessControlList.PublicRead.toString());
        return generatePresignedUrlRequest;
    }

    /* get 용 URL 생성하는 메소드 */
    private GeneratePresignedUrlRequest getGetGeneratePresignedUrlRequest(String key, Date expiration) {
        return new GeneratePresignedUrlRequest(bucket, key)
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);
    }

    private static Date getExpiration() {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60; // 1시간으로 설정하기
        expiration.setTime(expTimeMillis);
        return expiration;
    }

}
