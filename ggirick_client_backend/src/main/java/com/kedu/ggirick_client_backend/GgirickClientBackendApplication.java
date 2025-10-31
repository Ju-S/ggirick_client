package com.kedu.ggirick_client_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GgirickClientBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GgirickClientBackendApplication.class, args);
    }

}
