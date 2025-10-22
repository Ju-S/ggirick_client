package com.kedu.ggirick_client_backend.services.address;

import com.kedu.ggirick_client_backend.dao.address.AddressDAO;
import com.kedu.ggirick_client_backend.dao.address.AddressGroupTypeDAO;
import com.kedu.ggirick_client_backend.dto.address.AddressGroupTypeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressGroupTypeService {
    private final AddressDAO aDAO;
    private final AddressGroupTypeDAO agtDAO;

    // 주소록 대분류 그룹 리스트 가져오기
    public List<AddressGroupTypeDTO> selectAll() {
        return agtDAO.selectAll();
    }
}
