package com.kedu.ggirick_client_backend.dto.mail;
import lombok.*;

import java.sql.Timestamp;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MailDTO {

    private int id;
    private String sender;
    private String title;
    private String content;
    private int status;
    private Timestamp sentAt;
    private String mailUid;
}
