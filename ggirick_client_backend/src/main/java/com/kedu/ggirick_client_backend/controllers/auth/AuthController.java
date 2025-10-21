package com.kedu.ggirick_client_backend.controllers.auth;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.employee.EmployeeDTO;

import com.kedu.ggirick_client_backend.services.AuthService;
import com.kedu.ggirick_client_backend.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final com.kedu.ggirick_client_backend.services.employee.EmployeeService employeeService;
    private final JWTUtil jwt;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody EmployeeDTO loginInfo) {
        System.out.println(loginInfo.getId());
        EmployeeDTO loginDTO = employeeService.login(loginInfo);
        if (loginDTO != null) {
            // 인증 토큰 생성
            UserTokenDTO tokenInfo = authService.getTokenInfo(loginInfo.getId());
            String token = jwt.createToken(tokenInfo);

            Map<String, Object> authInfo = new HashMap<>();
            authInfo.put("token", token);
            authInfo.put("authority", tokenInfo.getAuthority());

            return ResponseEntity.ok(authInfo);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
