package com.kedu.ggirick_client_backend.controllers.hr;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_client_backend.services.hr.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // 직원 수정
    @PutMapping
    public ResponseEntity<EmployeeDTO> updateEmployee(@AuthenticationPrincipal UserTokenDTO userInfo,
                                                      @RequestPart("employeeInfo") EmployeeDTO dto,
                                                      @RequestPart(value = "profileImg", required = false) MultipartFile profileImg) throws Exception {
        // 직원 정보 수정 하면서 프로필 이미지 업로드 및 URL 넣어주기.
        EmployeeDTO updated = null;
        if (dto.getId().equals(userInfo.getId())) {
            updated = employeeService.updateEmployee(dto, profileImg);
        }
        return (updated != null)
                ? ResponseEntity.ok(updated)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/duplcheck")
    public ResponseEntity<String> checkEmailDuplication(@RequestParam String email,
                                                        @RequestParam String phone,
                                                        @AuthenticationPrincipal UserTokenDTO userInfo) {
        List<EmployeeDTO> employeeList = employeeService.getAllEmployeeList().stream()
                .filter(emp -> !emp.getId().equals(userInfo.getId())) // userInfo.getId와 다른 것만
                .toList();

        String errorMsg = null;
        if (employeeList.stream().anyMatch(emp -> emp.getEmail() != null && emp.getEmail().equalsIgnoreCase(email))) {
            errorMsg = "존재하는 이메일입니다.";
        }
        if (employeeList.stream().anyMatch(emp -> emp.getPhone() != null && emp.getPhone().equals(phone))) {
            String msg = "존재하는 전화번호입니다.";
            errorMsg = errorMsg == null ? msg : errorMsg + msg;
        }

        if (errorMsg != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMsg);
        } else {
            return ResponseEntity.ok().build();
        }
    }

    // 로그인한 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<EmployeeDTO> getMyInfo(@AuthenticationPrincipal UserTokenDTO userInfo) {
        System.out.println("토큰으로 정보 가져오기");
        String id = userInfo.getId();
        System.out.println("가져온 아이디 : " + id);
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        EmployeeDTO myInfo = employeeService.getEmployeeInfo(id);
        return ResponseEntity.ok(myInfo);
    }

    // 직원 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeDetail(@PathVariable String id) {
        EmployeeDTO dto = employeeService.getEmployeeInfo(id);
        return (dto != null)
                ? ResponseEntity.ok(dto)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    // 직원 목록 조회
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployeeList() {
        List<EmployeeDTO> list = employeeService.getAllEmployeeList();
        return ResponseEntity.ok(list);
    }

    // 비밀번호 변경
    @PutMapping("/password/{id}")
    public ResponseEntity<Void> updatePassword(@PathVariable String id, @RequestBody EmployeeDTO dto) {
        dto.setId(id);
        employeeService.updatePassword(dto);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
