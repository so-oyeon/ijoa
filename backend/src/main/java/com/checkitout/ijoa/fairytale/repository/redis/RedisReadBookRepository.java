package com.checkitout.ijoa.fairytale.repository.redis;

import com.checkitout.ijoa.fairytale.domain.redis.RedisReadBook;
import org.springframework.data.repository.CrudRepository;

public interface RedisReadBookRepository extends CrudRepository<RedisReadBook, String> {
}
