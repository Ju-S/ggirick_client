package com.kedu.ggirick_client_backend.controllers.address;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.address.*;
import com.kedu.ggirick_client_backend.dto.hr.DepartmentDTO;
import com.kedu.ggirick_client_backend.services.address.AddressGroupService;
import com.kedu.ggirick_client_backend.services.address.AddressGroupTypeService;
import com.kedu.ggirick_client_backend.services.address.AddressService;
import com.kedu.ggirick_client_backend.services.address.EmployeeAddressShareGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final EmployeeAddressShareGroupService easgServ;

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

    // 공유주소록 부서그룹 Read
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDTO>> getDepartments() {
        List<DepartmentDTO> list = agServ.selectAllDepartments();
            return ResponseEntity.ok().body(list);

    }

    // 공유주소록 해당 부서 내에 직원들 정보 Read
    @GetMapping("/shared/{code}")
    public ResponseEntity<List<ShareAddressDTO>> getAddressesByCode(@PathVariable String code) {
        List<ShareAddressDTO> list = aServ.getAddressesByCode(code);
        return ResponseEntity.ok().body(list);
    }

    // 주소록 소분류 그룹 Read
    @GetMapping("/group")
    public ResponseEntity<List<AddressGroupDTO>> getAddressGroups(@AuthenticationPrincipal UserTokenDTO userToken) {
        List<AddressGroupDTO> list = agServ.selectAll(userToken);
        return ResponseEntity.ok().body(list);
    }

    // 개인주소록 생성
    @PostMapping("/insert-group")
    public ResponseEntity<Void> addAddressGroup(@AuthenticationPrincipal UserTokenDTO userToken, @RequestBody AddressGroupDTO agDTO) {
        agDTO.setOwner(userToken.getId());
        agServ.addAddressGroup(agDTO);
        return ResponseEntity.ok().build();

    }
    // 주소록 그룹 삭제
    @DeleteMapping("/delete-group/{subGroupId}")
    public ResponseEntity<String> deleteSubGroup(@PathVariable int subGroupId) {
        int deleted = agServ.deleteAddressGroup(subGroupId);
        if (deleted > 0) {
            return ResponseEntity.ok("삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("삭제 실패");
        }

    }
    // 주소록 정보 가져오기
    @GetMapping("/subgroup/{subGroupId}/addresses")
    public ResponseEntity<List<AddressDTO>> getAddressesBySubGroup(@PathVariable int subGroupId) {
        List<AddressDTO> list = aServ.getAddressesBySubGroup(subGroupId);
        return ResponseEntity.ok().body(list);
    }

    // 주소록 정보 삭제
    @DeleteMapping("/delete-address/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable int addressId){
        aServ.deleteAddressByAddressId(addressId);
        return ResponseEntity.ok().build();
    }
    // 주소록 정보 수정
    @PutMapping("/update-address/{addressId}")
    public ResponseEntity<Void> updateAddress(@PathVariable int addressId, @RequestBody AddressDTO addressDTO) {
        aServ.updateAddressByAddressId(addressId,addressDTO);
        System.out.println(addressId);
        return ResponseEntity.ok().build();
    }



}
