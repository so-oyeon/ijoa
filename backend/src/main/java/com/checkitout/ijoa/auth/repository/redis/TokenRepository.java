package com.checkitout.ijoa.auth.repository.redis;

import com.checkitout.ijoa.auth.domain.redis.RedisToken;
import org.springframework.data.repository.CrudRepository;

public interface TokenRepository extends CrudRepository<RedisToken, Long> {
}
