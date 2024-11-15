package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import java.util.List;

public interface FairytaleRepositoryCustom {
    
    List<Fairytale> findFairytalesByIds(List<Long> ids);
}
