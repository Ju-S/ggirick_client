package com.kedu.ggirick_client_backend.controllers;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.services.AuthService;
import com.kedu.ggirick_client_backend.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor

public class TestController {

    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final AuthService authService;

    @Value("${SECRET_KEY}") String test;

    @GetMapping("/testLogin")
    public String testLogin() {
        UserTokenDTO tokenInfo = authService.getTokenInfo("EMP003");
        System.out.println(tokenInfo.getId() + " : " + tokenInfo.getAuthority());
        return jwtUtil.createToken(tokenInfo);
    }

    @GetMapping("/test")
    public UserTokenDTO test(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return userInfo;
    }
}
