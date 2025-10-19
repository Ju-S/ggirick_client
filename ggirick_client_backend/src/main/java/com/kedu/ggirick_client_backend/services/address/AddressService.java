package com.kedu.ggirick_client_backend.services.address;

import com.kedu.ggirick_client_backend.dao.address.AddressDAO;
import com.kedu.ggirick_client_backend.dto.address.AddressDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.amqp.RabbitConnectionDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressDAO aDAO;

    public int addAddress(AddressDTO addressDTO) {
        return aDAO.addAddress(addressDTO);
    }

    public List<AddressDTO> getAddressesBySubGroup(int subGroupId) {
        return aDAO.getAddressesBySubGroup(subGroupId);
    }
}
