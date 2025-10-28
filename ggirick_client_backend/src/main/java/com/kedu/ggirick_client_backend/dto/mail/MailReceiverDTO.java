package com.kedu.ggirick_client_backend.dto.mail;

import lombok.*;

import java.sql.Timestamp;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MailReceiverDTO {
    private int id;
    private int mailId;
    private String receiver;
    private Timestamp receivedAt;
    private int typeId; // 참조구분
    private int statusId; // 읽음,중요,안읽음 등등 구분 처리위함
}
