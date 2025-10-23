package com.kedu.ggirick_client_backend.services.address;

import com.kedu.ggirick_client_backend.dao.address.AddressDAO;
import com.kedu.ggirick_client_backend.dto.address.AddressDTO;
import com.kedu.ggirick_client_backend.dto.address.ShareAddressDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.amqp.RabbitConnectionDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressDAO aDAO;
    // 개인주소록 정보 입력
    public int addAddress(AddressDTO addressDTO) {
        return aDAO.addAddress(addressDTO);
    }
    // 개인주소록 소분류 그룹에 주소록 정보가져옴
    public List<AddressDTO> getAddressesBySubGroup(int subGroupId) {
        return aDAO.getAddressesBySubGroup(subGroupId);
    }
    // 개인주소록 주소록 정보 삭제
    public int deleteAddressByAddressId(int addressId) {
        return aDAO.deleteAddressByAddressId(addressId);
    }
    // 개인주소록 주소록 정보 수정
    public int updateAddressByAddressId(int addressId, AddressDTO addressDTO) {
        return aDAO.updateAddressByAddressId(addressId,addressDTO);
    }
    // 공유주소록에 주소록 정보 Read
    public List<ShareAddressDTO> getAddressesByCode(String code) {
        return aDAO.getAddressesByCode(code);
    }
}
