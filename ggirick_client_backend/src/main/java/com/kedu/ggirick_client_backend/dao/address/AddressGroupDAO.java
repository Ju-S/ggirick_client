package com.kedu.ggirick_client_backend.dao.address;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.address.AddressGroupDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AddressGroupDAO {
    private final SqlSession mybatis;

    public List<AddressGroupDTO> selectAll(UserTokenDTO userToken) {
        return mybatis.selectList("Address.AddressGroupSelectAll", userToken);
    }

    public int addAddressGroup(AddressGroupDTO addressGroupDTO) {
        return mybatis.insert("Address.addAddressGroup", addressGroupDTO);
    }

    public int deleteAddressGroup(int subGroupId) {
        return mybatis.delete("Address.deleteAddressGroup", subGroupId);
    }
}
