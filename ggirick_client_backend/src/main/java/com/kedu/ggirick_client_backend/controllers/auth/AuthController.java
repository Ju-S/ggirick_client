package com.kedu.ggirick_client_backend.controllers.auth;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.auth.ResetPasswordDTO;
import com.kedu.ggirick_client_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_client_backend.services.auth.AuthService;
import com.kedu.ggirick_client_backend.services.hr.EmployeeService;
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
    private final EmployeeService employeeService;
    private final JWTUtil jwt;
    private final AuthService authService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody EmployeeDTO loginInfo) {
        System.out.println(loginInfo.getId());
        EmployeeDTO loginDTO = authService.login(loginInfo);
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

    // 초기 비밀번호로 로그인했는지 체크
    @GetMapping("/checkResetRequired")
    public ResponseEntity<Boolean> checkResetRequired(@AuthenticationPrincipal UserTokenDTO userInfo) {
        boolean exists = authService.existsInPasswordReset(userInfo.getId());
        return ResponseEntity.ok(exists); // true면 초기비밀번호 상태
    }

    // 초기 비밀번호 변경 + 이메일 + 폰 번호 등록
    @PostMapping("/resetPassword")
    public ResponseEntity<Boolean> resetPassword(@RequestBody ResetPasswordDTO dto,
                                                 @AuthenticationPrincipal UserTokenDTO userInfo) {
        dto.setEmpId(userInfo.getId());
        boolean success = authService.resetPassword(dto);
        return ResponseEntity.ok(success);
    }

    // JWT 인증 토큰 유효한지 검사
    @GetMapping("/verify")
    public ResponseEntity<String> verifyToken(@AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo.getId() == null) {
            // JWTInterceptor가 이미 인증 실패 시 401을 반환하지만
            // 혹시 모를 누락 대비용
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
