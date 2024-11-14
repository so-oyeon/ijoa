package com.checkitout.ijoa.config;

import com.checkitout.ijoa.TTS.dto.request.AudioPathDto;
import com.checkitout.ijoa.TTS.dto.request.ErrorDto;
import com.checkitout.ijoa.TTS.dto.request.ModelPathDto;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    private Map<String, Object> consumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "k11d105.p.ssafy.io:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "tts_group");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return props;
    }

    // ModelPathDto 전용 ConsumerFactory 및 KafkaListenerContainerFactory 설정
    @Bean
    public ConsumerFactory<String, ModelPathDto> modelPathConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new ErrorHandlingDeserializer<>(new StringDeserializer()),
                new ErrorHandlingDeserializer<>(new JsonDeserializer<>(ModelPathDto.class))
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ModelPathDto> modelPathKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ModelPathDto> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(modelPathConsumerFactory());
        return factory;
    }

    // audioPath 전용 ConsumerFactory 및 KafkaListenerContainerFactory 설정
    @Bean
    public ConsumerFactory<String, AudioPathDto> audioPathConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new ErrorHandlingDeserializer<>(new StringDeserializer()),
                new ErrorHandlingDeserializer<>(new JsonDeserializer<>(AudioPathDto.class))
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AudioPathDto> audioPathKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, AudioPathDto> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(audioPathConsumerFactory());
        return factory;
    }

    // errormessage 전용 ConsumerFactory 및 KafkaListenerContainerFactory 설정
    @Bean
    public ConsumerFactory<String, ErrorDto> errorMessageConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new ErrorHandlingDeserializer<>(new StringDeserializer()),
                new ErrorHandlingDeserializer<>(new JsonDeserializer<>(ErrorDto.class))
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ErrorDto> errorMessageKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ErrorDto> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(errorMessageConsumerFactory());
        return factory;
    }
}
