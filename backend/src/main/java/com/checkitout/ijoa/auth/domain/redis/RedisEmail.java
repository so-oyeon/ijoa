package com.checkitout.ijoa.auth.domain.redis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "email", timeToLive = 5 * 60)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RedisEmail {

    @Id
    private String email;

    private String authCode;
}
