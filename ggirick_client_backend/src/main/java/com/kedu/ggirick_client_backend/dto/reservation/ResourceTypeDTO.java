package com.kedu.ggirick_client_backend.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceTypeDTO {
    private int id;
    private String name;
    private String typecode;
}
