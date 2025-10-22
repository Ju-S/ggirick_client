package com.kedu.ggirick_client_backend.dto.address;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareAddressDTO {
    private String name;
    private String phone;
    private String extension;
    private String email;
    private String department;
    private String rank;
    private String companyName;
}
