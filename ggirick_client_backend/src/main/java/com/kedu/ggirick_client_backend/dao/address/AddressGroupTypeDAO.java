package com.kedu.ggirick_client_backend.dao.address;

import com.kedu.ggirick_client_backend.dto.address.AddressGroupTypeDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AddressGroupTypeDAO {
    private final SqlSession mybatis;

    public List<AddressGroupTypeDTO> selectAll() {
        return mybatis.selectList("Address.AddressGroupTypeSelectAll");
    }
}
