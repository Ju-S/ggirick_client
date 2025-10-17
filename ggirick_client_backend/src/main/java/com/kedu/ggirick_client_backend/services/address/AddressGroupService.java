package com.kedu.ggirick_client_backend.services.address;

import com.kedu.ggirick_client_backend.dao.address.AddressDAO;
import com.kedu.ggirick_client_backend.dao.address.AddressGroupDAO;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.address.AddressGroupDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressGroupService {
    private final AddressGroupDAO agDAO;

    public List<AddressGroupDTO> selectAll(UserTokenDTO userToken) {
        return agDAO.selectAll(userToken);
    }
}
