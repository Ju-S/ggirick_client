package com.kedu.ggirick_client_backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatChannelParticipantDTO {
    private Long id;           // PK
    private Long channelId;    // 채널 ID (FK)
    private String employeeId; // 사용자 ID
    private String name; //사용자 이름 (join해서 가져오기)
    private String profileUrl; //사용자 프로필 (join해서 가져오기)
    private Timestamp joinedAt; // 참여 시각
    private Timestamp leftAt;   // 퇴장 시각, null이면 아직 참여 중
}