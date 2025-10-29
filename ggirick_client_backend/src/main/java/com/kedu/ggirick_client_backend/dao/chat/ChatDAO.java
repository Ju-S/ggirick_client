package com.kedu.ggirick_client_backend.dao.chat;

import com.kedu.ggirick_client_backend.dto.chat.ChatFileDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageFromDBDTO;
import com.kedu.ggirick_client_backend.dto.chat.ReactionDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kedu.ggirick_client_backend.config.ChatConfig.initialChatMessageSize;

@Repository
public class ChatDAO {
    @Autowired
    private SqlSessionTemplate mybatis;

    public boolean saveMessage(ChatMessageDTO message) {
      return mybatis.insert("Chat.insertMessage", message) > 0;
    }

    public  boolean saveFile(ChatFileDTO file) {
        return mybatis.insert("Chat.insertFile", file) > 0;
    }

    public List<ChatMessageFromDBDTO> selectMessagesByChannel(Long workspaceId, Long channelId) {
        Map<String,Object> map = new HashMap<>();
        map.put("workspaceId", workspaceId);
        map.put("channelId", channelId);
        map.put("offset", initialChatMessageSize);
        return mybatis.selectList("Chat.selectMessagesByChannel",map);
    }


    public boolean existsReaction(ChatMessageDTO m) {

        Integer count = mybatis.selectOne("Chat.existsReaction", m);
        return count != null && count > 0;
    }

    public void insertReaction(ChatMessageDTO m) {


        mybatis.insert("Chat.insertReaction",  m);
    }

    public void deleteReaction(ChatMessageDTO m) {

        mybatis.delete("Chat.deleteReaction", m);
    }

    public int getLikeCount(ChatMessageDTO m) {
        return mybatis.selectOne("Chat.countLike", m);
    }

    public List<String> whoseLikeMessage(ChatMessageDTO m) {
        return mybatis.selectList("Chat.whoseLikeMessage", m);
    }

    public boolean existsLike(ChatMessageDTO m) {

        Integer count = mybatis.selectOne("Chat.existsLike", m);
        return count != null && count > 0;
    }

    public void deleteLike(ChatMessageDTO m) {

        mybatis.delete("Chat.deleteLike",m);
    }

    public void insertLike(ChatMessageDTO m) {

        mybatis.insert("Chat.insertLike",m);
    }

    public boolean existsViewed(ChatMessageDTO m) {
        Integer count = mybatis.selectOne("Chat.existsView", m);
        return count != null && count > 0;
    }

    public void deleteView(ChatMessageDTO m) {
        mybatis.delete("Chat.deleteView",m);
    }

    public void insertView(ChatMessageDTO m) {
        mybatis.insert("Chat.insertView",m);
    }

    public List<Map<String, String>> getReactionsForMessage(String messageId) {
        return  mybatis.selectList("Chat.getReactionsForMessage",messageId);
    }
    

    public LocalDateTime getMessageCreatedAt(String messageId) {
        return mybatis.selectOne("Chat.getMessageCreatedAt", messageId);
    }

    public List<ChatMessageFromDBDTO> selectOlderMessages(Map<String, Object> params) {
        return mybatis.selectList("Chat.selectOlderMessages", params);
    }

    public void insertChatFile(ChatFileDTO fileDTO) {
            mybatis.insert("Chat.insertFile", fileDTO);
    }

    public List<Map<String, Object>> getLikeCounts(List<String> messageIds) {
        return mybatis.selectList("Chat.getLikeCounts", messageIds);
    }

    public List<Map<String, Object>> getLikeUsersMap(List<String> messageIds) {
        return mybatis.selectList("Chat.getLikeUsersMap", messageIds);
    }

    public List<Map<String, Object>> getReactionsMap(List<String> messageIds) {
        return mybatis.selectList("Chat.getReactionsMap", messageIds);
    }


    public List<Map<String, Object>>  getViewersMap(List<String> messageIds) {
        return mybatis.selectList("Chat.getViewersMap", messageIds);
    }

    public List<ChatMessageFromDBDTO> selectMessagesByChannelUltimate(Long workspaceId, Long channelId) {
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("channelId", channelId);
        params.put("offset", initialChatMessageSize); // 기존처럼 페이징용

        return mybatis.selectList("Chat.selectMessagesByChannelUltimate", params);
    }

    public boolean deleteFile(int id) {
        return mybatis.delete("Chat.deleteFile", id) > 0;
    }
}
