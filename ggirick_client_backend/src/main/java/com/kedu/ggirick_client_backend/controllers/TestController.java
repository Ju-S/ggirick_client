package com.kedu.ggirick_client_backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    private final PasswordEncoder passwordEncoder;
    @Value("${SECRET_KEY}") String test;

    public TestController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/test")
    public String test() {
        return passwordEncoder.encode("test") + " : " + test;
    }
}
