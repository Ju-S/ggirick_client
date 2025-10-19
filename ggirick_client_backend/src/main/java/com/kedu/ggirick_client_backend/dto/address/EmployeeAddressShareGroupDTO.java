package com.kedu.ggirick_client_backend.dto.address;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAddressShareGroupDTO {
    private int id;
    private int groupId;
    private String employeeId;
    private int TypeId;
}
