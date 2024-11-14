package com.checkitout.ijoa.fairytale.repository;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.QFairytale;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class FairytaleRepositoryImpl implements FairytaleRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Fairytale> findFairytalesByIds(List<Long> ids) {
        QFairytale fairytale = QFairytale.fairytale;

        Map<Long, Integer> idToOrderMap = buildIdToOrderMap(ids);
        NumberExpression<Integer> orderExpression = buildOrderExpression(fairytale, idToOrderMap);

        return queryFactory.selectFrom(fairytale)
                .where(fairytale.id.in(ids))
                .orderBy(orderExpression.asc())
                .fetch();
    }

    private Map<Long, Integer> buildIdToOrderMap(List<Long> ids) {
        Map<Long, Integer> idToOrderMap = new HashMap<>();
        for (int i = 0; i < ids.size(); i++) {
            idToOrderMap.put(ids.get(i), i);
        }
        return idToOrderMap;
    }

    private NumberExpression<Integer> buildOrderExpression(QFairytale fairytale, Map<Long, Integer> idToOrderMap) {
        CaseBuilder.Cases<Integer, NumberExpression<Integer>> orderCase = new CaseBuilder().when(fairytale.id.eq(-1L))
                .then(-1);

        for (Map.Entry<Long, Integer> entry : idToOrderMap.entrySet()) {
            orderCase = orderCase.when(fairytale.id.eq(entry.getKey())).then(entry.getValue());
        }

        return orderCase.otherwise(idToOrderMap.size());
    }
}