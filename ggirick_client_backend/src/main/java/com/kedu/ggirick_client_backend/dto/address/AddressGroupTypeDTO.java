package com.kedu.ggirick_client_backend.dto.address;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressGroupTypeDTO {
    private int id;
    private String name;
    private String description;
}
