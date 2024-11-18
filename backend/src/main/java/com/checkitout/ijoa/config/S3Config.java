package com.checkitout.ijoa.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class S3Config {

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${S3_ACCESSKEY}")
    private String S3_ACCESSKEY;

    @Value("${S3_SECRETKEY}")
    private String S3_SECRETKEY;

    @Bean
    public AmazonS3Client amazonS3Client() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(S3_ACCESSKEY, S3_SECRETKEY);

        return (AmazonS3Client) AmazonS3ClientBuilder.standard().withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).build();
    }
}
