package com.kedu.ggirick_client_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTokenDTO {
    private String id;
    private int authority; // grade
}
