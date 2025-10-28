package com.kedu.ggirick_client_backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentBlock {

    private String id;
    private String type;                   // "paragraph", "audio", "video", "image"
    private Map<String, Object> props;     // url, name, caption, showPreview 등
    private List<ContentBlock> children;   // 하위 블록
    private List<ContentBlock> content;    // paragraph 블록의 텍스트 블록
}
