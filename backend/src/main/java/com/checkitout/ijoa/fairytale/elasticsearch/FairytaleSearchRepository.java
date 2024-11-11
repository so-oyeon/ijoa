package com.checkitout.ijoa.fairytale.elasticsearch;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FairytaleSearchRepository extends ElasticsearchRepository<Fairytale, Long> {

    @Query("{\"wildcard\": {\"title\": \"*?0*\"}}")
    Page<Fairytale> findByTitle(String title, Pageable pageable);
}
