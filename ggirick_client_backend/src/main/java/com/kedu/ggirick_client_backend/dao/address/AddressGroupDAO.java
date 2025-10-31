package com.kedu.ggirick_client_backend.dao.address;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.address.AddressGroupDTO;
import com.kedu.ggirick_client_backend.dto.hr.DepartmentDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AddressGroupDAO {
    private final SqlSession mybatis;

    // 개인주소록 소분류 그룹 가져오기
    public List<AddressGroupDTO> selectAll(UserTokenDTO userToken) {
        return mybatis.selectList("Address.AddressGroupSelectAll", userToken);
    }
    // 개인주소록 소분류 그룹 만들기
    public int addAddressGroup(AddressGroupDTO addressGroupDTO) {
        return mybatis.insert("Address.addAddressGroup", addressGroupDTO);
    }
    // 개인주소록 소분류 그룹 삭제
    public int deleteAddressGroup(int subGroupId) {
        return mybatis.delete("Address.deleteAddressGroup", subGroupId);
    }

    // 공유주소록 부서명 Read
    public List<DepartmentDTO> selectAllDepartments() {
        return mybatis.selectList("Address.selectAllDepartments");
    }
}
