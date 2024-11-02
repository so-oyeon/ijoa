package com.checkitout.ijoa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(servers = {@Server(url = "https://k11d105.p.ssafy.io/api/v1", description = "default server url"),
        @Server(url = "http://localhost:8080/api/v1", description = "LOCAL")
})
@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
