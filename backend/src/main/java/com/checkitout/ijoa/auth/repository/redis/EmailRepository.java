package com.checkitout.ijoa.auth.repository.redis;

import com.checkitout.ijoa.auth.domain.redis.RedisEmail;
import org.springframework.data.repository.CrudRepository;

public interface EmailRepository extends CrudRepository<RedisEmail, String> {
}
