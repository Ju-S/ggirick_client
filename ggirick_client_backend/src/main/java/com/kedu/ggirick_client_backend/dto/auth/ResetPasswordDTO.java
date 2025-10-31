package com.kedu.ggirick_client_backend.dto.auth;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    private String empId;       // 토큰에서 주입
    private String newPw;       // 새 비밀번호
    private String email;       // 등록할 이메일
    private String phone;       // 등록한 번호
}
