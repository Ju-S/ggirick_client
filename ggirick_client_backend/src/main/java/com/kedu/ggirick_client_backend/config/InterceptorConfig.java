package com.kedu.ggirick_client_backend.config;

import com.kedu.ggirick_client_backend.interceptors.JWTInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer { // JWT interceptor 설정

    private final JWTInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
        .addPathPatterns("/**") // 모든 요청 필터링
        .excludePathPatterns("/auth/login"); // 허용해줄 url 필터링
    }
}
