package com.checkitout.ijoa.fairytale.domain.redis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "readBook", timeToLive = 3 * 24 * 60 * 60)//3일
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RedisReadBook {

    @Id
    private String id;
    private int currentPage;
    private boolean isCompleted;

    public RedisReadBook(Long bookId, Long childId, int currentPage, boolean isCompleted) {
        this.id = bookId + ":" + childId;
        this.currentPage = currentPage;
        this.isCompleted = isCompleted;
    }
}
