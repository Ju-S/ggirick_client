package com.kedu.ggirick_client_backend.websocket;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.kedu.ggirick_client_backend.services.auth.AuthService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;


@RequiredArgsConstructor
@Component
@Slf4j
public class ChatPreHandler implements ChannelInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JWTUtil jwtUtil;
    private final AuthService authService; // 기존 JWTInterceptor처럼 user 조회

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT == accessor.getCommand()) { // websocket 연결
            String jwtToken = accessor.getFirstNativeHeader("Authorization");

            if (jwtToken == null || !jwtToken.startsWith(BEARER_PREFIX)) {
                throw new IllegalArgumentException("Missing or invalid Authorization header");
            }

            String token = jwtToken.substring(7);

            try {
                DecodedJWT djwt = jwtUtil.verifyToken(token); // 기존 verifyToken 그대로 사용

                UserTokenDTO user = authService.getTokenInfo(djwt.getSubject()); // 기존 JWTInterceptor처럼 user 조회

                accessor.getSessionAttributes().put("user", user); // 세션에 저장

                log.info("[STOMP] CONNECT by user {}", user.getId());

            } catch (Exception e) {
                log.error("[STOMP] Invalid token", e);
                throw new IllegalArgumentException("Invalid token");
            }
        }

        return message;
    }
}
