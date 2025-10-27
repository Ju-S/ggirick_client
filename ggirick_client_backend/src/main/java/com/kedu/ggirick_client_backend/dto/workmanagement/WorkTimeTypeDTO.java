package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WorkTimeTypeDTO {
    private String type;  // in / out / leave 등
    private String name;  // ex: 외출
}
