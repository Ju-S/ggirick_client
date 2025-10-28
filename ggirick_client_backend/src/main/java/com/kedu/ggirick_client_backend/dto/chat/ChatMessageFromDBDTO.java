package com.kedu.ggirick_client_backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageFromDBDTO extends ChatMessageDTO{

    private int like_count;                 // 좋아요 수
    private List<String> likeUsers;   // 좋아요 누른 사람 ID 리스트
    private List<ReactionDTO> reactions; // 이모지 반응 리스트
    private List<String> viewer; //읽은 사람

    private String likeUsersRaw;              // "101,102,103"
    private String viewersRaw;                // "101,104"
    private String reactionsRaw;              // "🔥:101,😂:103"
}
