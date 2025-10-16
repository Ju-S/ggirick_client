package com.kedu.ggirick_client_backend.controllers;

import com.kedu.ggirick_client_backend.services.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final BoardService boardService;
    private final PasswordEncoder passwordEncoder;

    @Value("${SECRET_KEY}")
    String test;

    @GetMapping("/test")
    public String test() {
        return passwordEncoder.encode("test") + " : " + test;
    }
}
