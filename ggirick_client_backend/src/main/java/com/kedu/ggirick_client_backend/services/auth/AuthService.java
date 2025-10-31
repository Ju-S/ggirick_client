package com.kedu.ggirick_client_backend.services.auth;


import com.kedu.ggirick_client_backend.dao.AuthDAO;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.auth.ResetPasswordDTO;
import com.kedu.ggirick_client_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_client_backend.services.hr.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthDAO authDAO;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeService employeeService;

    // 로그인
    public EmployeeDTO login(EmployeeDTO dto) {
        EmployeeDTO employeeDTO = employeeService.getById(dto);

        // ID, PW 비교
        if (employeeDTO != null && passwordEncoder.matches(dto.getPw(), employeeDTO.getPw())) {
            return employeeDTO;
        }
        return null;
    }

    public UserTokenDTO getTokenInfo(String id) {
        return authDAO.getTokenInfo(id);
    }

    // 초기 비밀번호로 로그인했는지 체크
    public boolean existsInPasswordReset(String empId) {
        return authDAO.existsInPasswordReset(empId) > 0;
    }

    // 초기 비밀번호 변경 + 이메일/번호 등록
    @Transactional
    public boolean resetPassword(ResetPasswordDTO dto) {
        // 1. 새 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(dto.getNewPw());

        // 2. 비밀번호 + 이메일 + 핸드폰 업데이트
        boolean updated = employeeService.updatePasswordAndEmailAndPhone(dto.getEmpId(), encodedPw, dto.getEmail(), dto.getPhone());

        // 3. password_reset 테이블에서 id 삭제
        boolean deleted = authDAO.deletePasswordResetById(dto.getEmpId()) > 0;

        return updated && deleted;
    }
}
