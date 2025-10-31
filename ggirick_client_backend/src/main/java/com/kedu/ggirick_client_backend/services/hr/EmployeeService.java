package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.hr.EmployeeDAO;
import com.kedu.ggirick_client_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_client_backend.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeDAO employeeDAO;
    private final PasswordEncoder passwordEncoder;
    private final FileUtil fileUtil;

    // ID만 가져오기 - 로그인 기능에 사용
    public EmployeeDTO getById(EmployeeDTO dto) {
        return employeeDAO.getById(dto);
    }

    // 사원 삭제
    public void deleteEmployee(String id) {
        employeeDAO.deleteEmployeeById(id);
    }

    // 사원 정보 수정
    public EmployeeDTO updateEmployee(EmployeeDTO dto, MultipartFile profileImg) throws Exception {
        if (!profileImg.isEmpty()) {
            String path = "profile/" + dto.getId() + "/";
            Map<String, String> profileImgInfo = fileUtil.uploadFileAndGetInfo(profileImg.getOriginalFilename(), path, profileImg);

            dto.setProfileUrl(profileImgInfo.get("url"));
        }
        return employeeDAO.updateEmployeeById(dto);
    }

    // 사원 한명 정보
    public EmployeeDTO getEmployeeInfo(String id) {
        return employeeDAO.getEmployeeInfo(id);
    }

    // 직원 전체 목록
    public List<EmployeeDTO> getAllEmployeeList() {
        return employeeDAO.getAllEmployeeList();
    }

    // 비밀번호 변경
    public boolean updatePassword(EmployeeDTO dto) {
        // 암호화 후 DB 저장
        dto.setPw(passwordEncoder.encode(dto.getPw()));
        return employeeDAO.updatePassword(dto);
    }

    // 이메일 중복 여부 확인
    public boolean isEmailDuplicate(String email, String userId) {
        Map<String, Object> params = new HashMap<>();

        params.put("email", email);
        params.put("userId", userId);

        return employeeDAO.isEmailDuplicate(params) > 0;
    }

    // 핸드폰 번호 중복 여부 확인
    public boolean isPhoneDuplicate(String phone, String userId) {
        Map<String, Object> params = new HashMap<>();

        params.put("phone", phone);
        params.put("userId", userId);

        return employeeDAO.isPhoneDuplicate(params) > 0;
    }

    // 초기 비밀번호, 이메일, 핸드폰 번호 입력
    public boolean updatePasswordAndEmailAndPhone(String employeeId, String encodePw, String email, String phone) {
        Map<String, String> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("encodePw", encodePw);
        params.put("email", email);
        params.put("phone", phone);

        return employeeDAO.updatePasswordAndEmailAndPhone(params) > 0;
    }
}
