package com.kedu.ggirick_client_backend.interceptors;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.kedu.ggirick_client_backend.utils.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class JWTInterceptor implements HandlerInterceptor {

    private final JWTUtil jwt;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 나중엔 url 별로 어떤 url은 인터셉트하고 어떤 url은 인터셉트 안 할건지 지정
        String authHeader = request.getHeader("Authorization");

        if(authHeader != null) {
            String token = authHeader.substring(7);

            try {
                DecodedJWT djwt = jwt.verifyToken(token);
                // 인터셉터에서 미리 ID를 꺼내서 넘겨주는게 편함. - 가장 많이 사용하는 정보
                // request.setAttribute("loginId", djwt.getSubject());
                return true;
            }catch (Exception e){ // 인증 실패시
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
