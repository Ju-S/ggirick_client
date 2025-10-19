package com.kedu.ggirick_client_backend.services.address;

import com.kedu.ggirick_client_backend.dao.address.EmployeeAddressShareGroupDAO;
import com.kedu.ggirick_client_backend.dto.address.EmployeeAddressShareGroupDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeAddressShareGroupService {
    private final EmployeeAddressShareGroupDAO easgDAO;

//    public int addShareGroup(EmployeeAddressShareGroupDTO easgDTO) {
//        return easgDAO.addShareGroup(easgDTO);
//    }
}
