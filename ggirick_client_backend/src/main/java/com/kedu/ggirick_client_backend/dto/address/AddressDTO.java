package com.kedu.ggirick_client_backend.dto.address;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private int id;
    private String name;
    private String companyName;
    private String department;
    private String rank;
    private String email;
    private String phone;
    private String address;
    private int groupId;
}
