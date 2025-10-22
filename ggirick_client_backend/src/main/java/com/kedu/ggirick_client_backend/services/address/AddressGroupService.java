package com.kedu.ggirick_client_backend.services.address;

import com.kedu.ggirick_client_backend.dao.address.AddressDAO;
import com.kedu.ggirick_client_backend.dao.address.AddressGroupDAO;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.address.AddressGroupDTO;
import com.kedu.ggirick_client_backend.dto.common.DepartmentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressGroupService {
    private final AddressGroupDAO agDAO;

    // 개인주소록 소분류 그룹 가져오기
    public List<AddressGroupDTO> selectAll(UserTokenDTO userToken) {
        return agDAO.selectAll(userToken);
    }
    // 개인주소록 소분류 그룹 만들기
    public int addAddressGroup(AddressGroupDTO addressGroupDTO) {
        return agDAO.addAddressGroup(addressGroupDTO);
    }
    // 개인주소록 소분류 그룹 삭제
    public int deleteAddressGroup(int subGroupId) {
        return agDAO.deleteAddressGroup(subGroupId);
    }
    // 공유주소록 부서명 Read
    public List<DepartmentDTO> selectAllDepartments(){
        return agDAO.selectAllDepartments();
    }

}
