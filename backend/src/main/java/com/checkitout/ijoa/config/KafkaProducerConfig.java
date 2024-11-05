package com.checkitout.ijoa.config;

import com.checkitout.ijoa.TTS.dto.response.AudioBookRequestDto;
import com.checkitout.ijoa.TTS.dto.response.TrainAudioResponseDto;
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
    public Map<String, Object> producerConfigs() {
        Map<String, Object> configProps = new HashMap<>();

        // Kafka 서버 주소 설정
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "k11d105.p.ssafy.io:9092");

        // Key와 Value 직렬화기 설정
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        // 신뢰할 수 있는 패키지 설정
        configProps.put("spring.json.trusted.packages", "*");

        return configProps;
    }

    @Bean
    public ProducerFactory<String, AudioBookRequestDto> audioBookRequestProducerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Bean
    public KafkaTemplate<String, AudioBookRequestDto> audioBookRequestKafkaTemplate() {
        return new KafkaTemplate<>(audioBookRequestProducerFactory());
    }

    @Bean
    public ProducerFactory<String, TrainAudioResponseDto> trainAudioResponseProducerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Bean
    public KafkaTemplate<String, TrainAudioResponseDto> trainAudioResponseKafkaTemplate() {
        return new KafkaTemplate<>(trainAudioResponseProducerFactory());
    }
}
