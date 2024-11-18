package com.checkitout.ijoa;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@OpenAPIDefinition(servers = {@Server(url = "https://k11d105.p.ssafy.io/api/v1", description = "default server url"),
        @Server(url = "http://localhost:8080/api/v1", description = "LOCAL")
})
@SpringBootApplication
@EnableJpaRepositories("com.checkitout.ijoa.*.repository")
@EnableElasticsearchRepositories(basePackages = "com.checkitout.ijoa.fairytale.elasticsearch")
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
