package com.kedu.ggirick_client_backend.dto.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorityDTO {
    private int id;
    private int grade;
    private String name;
}
