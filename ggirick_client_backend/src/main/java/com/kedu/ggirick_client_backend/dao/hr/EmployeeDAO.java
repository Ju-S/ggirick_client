package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class EmployeeDAO {

    private final SqlSessionTemplate mybatis;

    // ID만 가져오기 - 로그인 때 사용
    public EmployeeDTO getById(EmployeeDTO dto) {
        return mybatis.selectOne("Employee.getById", dto);
    }

    // 직원 삭제
    public void deleteEmployeeById(String id) {
        mybatis.delete("Employee.deleteById", id);
    }

    // 직원 수정
    public EmployeeDTO updateEmployeeById(EmployeeDTO dto) {
        int result = mybatis.update("Employee.updateById", dto);
        if(result != 0) {
            return getEmployeeInfo(dto.getId());
        }
        return null;
    }

    // 직원 정보 가져오기
    public EmployeeDTO getEmployeeInfo(String id) {
        return mybatis.selectOne("Employee.getEmployeeInfo", id);
    }

    // 직원 전체 목록 가져오기
    public List<EmployeeDTO> getAllEmployeeList() {
        return mybatis.selectList("Employee.getAllEmployeeList");
    }

    // 비밀번호 변경
    public boolean updatePassword(EmployeeDTO dto) {
        return mybatis.update("Employee.updatePassword", dto) != 0;
    }

    // 이메일 중복 여부 확인
    public int isEmailDuplicate(Map<String, Object> params) {
        return mybatis.selectOne("Employee.isEmailDuplicate", params);
    }

    // 핸드폰 번호 중복 여부 확인
    public int isPhoneDuplicate(Map<String, Object> params) {
        return mybatis.selectOne("Employee.isPhoneDuplicate", params);
    }

    // 아이디 리스트로 이름 목록 검색
    public List<String> selectEmployeeNamesByIds(List<String> idLists) {
        return mybatis.selectList("hr.employee.selectEmployeeNamesByIds", idLists);
    }

    public int updatePasswordAndEmailAndPhone(Map<String, String> params) {
        return mybatis.update("Employee.updatePasswordAndEmailAndPhone", params);
    }
}
