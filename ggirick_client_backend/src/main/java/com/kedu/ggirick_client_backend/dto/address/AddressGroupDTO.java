package com.kedu.ggirick_client_backend.dto.address;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressGroupDTO {
    private int id;
    private String owner;
    private String groupName;
}
