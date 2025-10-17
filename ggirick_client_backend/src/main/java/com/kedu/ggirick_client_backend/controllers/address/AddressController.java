package com.kedu.ggirick_client_backend.controllers.address;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.address.AddressDTO;
import com.kedu.ggirick_client_backend.dto.address.AddressGroupDTO;
import com.kedu.ggirick_client_backend.dto.address.AddressGroupTypeDTO;
import com.kedu.ggirick_client_backend.services.address.AddressGroupService;
import com.kedu.ggirick_client_backend.services.address.AddressGroupTypeService;
import com.kedu.ggirick_client_backend.services.address.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = "http://10.5.5.2:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/address")
public class AddressController {
    private final AddressService aServ;
    private final AddressGroupTypeService agtServ;
    private final AddressGroupService agServ;

    // 주소록 추가
    @PostMapping
    public ResponseEntity<Void> addAddress(@RequestBody AddressDTO addressDTO) {
        aServ.addAddress(addressDTO);
        return ResponseEntity.ok().build();
    }

    // 주소록 대분류 그룹 Read
    @GetMapping("/group-type")
    public ResponseEntity<List<AddressGroupTypeDTO>> getAddressGroupsType() {
        List<AddressGroupTypeDTO> list = agtServ.selectAll();
        return ResponseEntity.ok().body(list);
    }

    // 주소록 소분류 그룹 Read
    @GetMapping("/group")
    public ResponseEntity<List<AddressGroupDTO>> getAddressGroups(@AuthenticationPrincipal UserTokenDTO userToken) {
        List<AddressGroupDTO> list = agServ.selectAll(userToken);
        return ResponseEntity.ok().body(list);
    }
}
