package com.kedu.ggirick_client_backend.dao.address;

import com.kedu.ggirick_client_backend.dto.address.AddressDTO;
import com.kedu.ggirick_client_backend.dto.address.ShareAddressDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
    public class AddressDAO {
        private final SqlSession mybatis;

    // 개인주소록 정보 입력
    public int addAddress(AddressDTO addressDTO) {
        return  mybatis.insert("Address.addAddress", addressDTO);
    }

    // 개인주소록 소분류 그룹에 주소록 정보가져옴
    public List<AddressDTO> getAddressesBySubGroup(int subGroup) {
        return mybatis.selectList("Address.getAddressesBySubGroup", subGroup);
    }

    // 개인주소록 주소록 정보 삭제
    public int deleteAddressByAddressId(int addressId) {
        return mybatis.delete("Address.deleteAddressByAddressId",addressId);
    }
    // 개인주소록 주소록 정보 수정
    public int updateAddressByAddressId(int addressId, @RequestBody AddressDTO addressDTO) {
        Map<String,Object> params = new HashMap<>();
        params.put("addressId",addressId);
        params.put("address",addressDTO);
        return mybatis.update("Address.updateAddressByAddressId",params);
    }
    // 공유주소록에 주소록 정보 Read
    public List<ShareAddressDTO> getAddressesByCode(String code) {
        return mybatis.selectList("Address.getAddressesByCode", code);
    }
}
