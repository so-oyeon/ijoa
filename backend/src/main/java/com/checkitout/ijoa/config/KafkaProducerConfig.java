package com.checkitout.ijoa.config;

import com.checkitout.ijoa.TTS.dto.response.AudioBookRequestDto;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, AudioBookRequestDto> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();

        // Kafka 서버 주소 설정
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "k11d105.p.ssafy.io:9092");

        // Key와 Value 직렬화기 설정
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        // 신뢰할 수 있는 패키지 설정
        configProps.put("spring.json.trusted.packages", "*");

        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, AudioBookRequestDto> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
