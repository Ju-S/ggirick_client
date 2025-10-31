package com.kedu.ggirick_client_backend.interceptors;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.services.auth.AuthService;
import com.kedu.ggirick_client_backend.utils.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JWTInterceptor implements HandlerInterceptor {

    private final JWTUtil jwt;
    private final AuthService authService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 나중엔 url 별로 어떤 url은 인터셉트하고 어떤 url은 인터셉트 안 할건지 지정
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null) {
            String token = authHeader.substring(7);

            try {
                DecodedJWT djwt = jwt.verifyToken(token);

                UserTokenDTO userTokenDTO = authService.getTokenInfo(djwt.getSubject());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userTokenDTO,
                                null,
                                List.of()
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
                return true;
            } catch (Exception e) { // 인증 실패시
                e.printStackTrace();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token Error");
                return false;
            }
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token Error");
            return false;
        }
    }
}
