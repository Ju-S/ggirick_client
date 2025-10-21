package com.kedu.ggirick_client_backend.dao.employee;

import com.kedu.ggirick_client_backend.dto.employee.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EmployeeDAO {

    private final SqlSessionTemplate mybatis;

    // ID만 가져오기 - 로그인 때 사용
    public EmployeeDTO getById(EmployeeDTO dto) {
        return mybatis.selectOne("hr.employee.getById", dto);
    }

    // 직원 삭제
    public void deleteEmployeeById(String id) {
        mybatis.delete("hr.employee.deleteById", id);
    }

    // 직원 수정
    public EmployeeDTO updateEmployeeById(EmployeeDTO dto) {
        int result = mybatis.update("hr.employee.updateById", dto);
        if(result != 0) {
            return getEmployeeInfo(dto.getId());
        }
        return null;
    }

    // 직원 정보 가져오기
    public EmployeeDTO getEmployeeInfo(String id) {
        return mybatis.selectOne("hr.employee.getEmployeeInfo", id);
    }

    // 직원 전체 목록 가져오기
    public List<EmployeeDTO> getAllEmployeeList() {
        return mybatis.selectList("hr.employee.getAllEmployeeList");
    }

    // 비밀번호 변경
    public boolean updatePassword(EmployeeDTO dto) {
        return mybatis.update("hr.employee.updatePassword", dto) != 0;
    }

}
