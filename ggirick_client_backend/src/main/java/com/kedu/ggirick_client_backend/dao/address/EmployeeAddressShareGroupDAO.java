package com.kedu.ggirick_client_backend.dao.address;

import com.kedu.ggirick_client_backend.dto.address.EmployeeAddressShareGroupDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EmployeeAddressShareGroupDAO {
    private final SqlSession mybatis;

//    public int addShareGroup(EmployeeAddressShareGroupDTO easgDTO) {
//        return mybatis.insert("Address.addShareGroup", easgDTO);
//    }
}
