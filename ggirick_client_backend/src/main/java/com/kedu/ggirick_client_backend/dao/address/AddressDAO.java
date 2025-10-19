package com.kedu.ggirick_client_backend.dao.address;

import com.kedu.ggirick_client_backend.dto.address.AddressDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
    public class AddressDAO {
        private final SqlSession mybatis;

    public int addAddress(AddressDTO addressDTO) {
        return  mybatis.insert("Address.addAddress", addressDTO);
    }

    public List<AddressDTO> getAddressesBySubGroup(int subGroup) {
        return mybatis.selectList("Address.getAddressesBySubGroup", subGroup);
    }
}
