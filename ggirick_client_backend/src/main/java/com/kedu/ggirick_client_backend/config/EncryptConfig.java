package com.kedu.ggirick_client_backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class EncryptConfig {
    @Value("${app.encrypt.secret}")
    private String secretKey;
    @Value("${app.encrypt.salt}")
    private String salt;

}
