package com.checkitout.ijoa.auth.domain.redis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "Token", timeToLive = 604800) // 7*24*60*60
@AllArgsConstructor
@Getter
@Setter
public class RedisToken {

    @Id
    private Long userId;
    private String refreshToken;
}
