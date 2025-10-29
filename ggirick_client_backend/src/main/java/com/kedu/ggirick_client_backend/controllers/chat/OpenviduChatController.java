package com.kedu.ggirick_client_backend.controllers.chat;


import io.openvidu.java.client.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/openvidu")
public class OpenviduChatController {


    private final RestTemplate restTemplate = new RestTemplate();

    private static final String OPENVIDU_URL = "http://10.5.5.1:4443/openvidu/api";
    private static final String SECRET = "MY_SECRET";

    // Basic Auth 헤더 생성
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String auth = "OPENVIDUAPP:" + SECRET;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedAuth);
        return headers;
    }

    /** ✅ 1️⃣ 세션 생성 (존재하면 그대로 사용) */
    @PostMapping("/sessions")
    public ResponseEntity<Map<String, Object>> createSession() {
        HttpHeaders headers = createHeaders();
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(Map.of(), headers);

        ResponseEntity<Map> response;
        try {
            response = restTemplate.exchange(
                    OPENVIDU_URL + "/sessions",
                    HttpMethod.POST,
                    request,
                    Map.class
            );
        } catch (HttpClientErrorException.Conflict e) {
            // 이미 존재하는 세션이면 그대로 사용
            Map<String, Object> conflictBody = Map.of("message", "Session already exists");
            return new ResponseEntity<>(conflictBody, HttpStatus.OK);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", response.getBody().get("id"));
        return ResponseEntity.ok(result);
    }

    /** ✅ 2️⃣ 세션 존재 확인 */
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<?> getSession(@PathVariable String sessionId) {
        HttpHeaders headers = createHeaders();
        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    OPENVIDU_URL + "/sessions/" + sessionId,
                    HttpMethod.GET,
                    request,
                    Map.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Session not found"));
        }
    }

    /** ✅ 3️⃣ 세션에 토큰 발급 */
    @PostMapping("/sessions/{sessionId}/token")
    public ResponseEntity<Map<String, String>> createToken(@PathVariable String sessionId) {
        HttpHeaders headers = createHeaders();
        Map<String, Object> tokenBody = new HashMap<>();
        tokenBody.put("role", "PUBLISHER");

        HttpEntity<Map<String, Object>> tokenRequest = new HttpEntity<>(tokenBody, headers);

        try {
            ResponseEntity<Map> tokenResponse = restTemplate.exchange(
                    OPENVIDU_URL + "/sessions/" + sessionId + "/connection",
                    HttpMethod.POST,
                    tokenRequest,
                    Map.class
            );
            Map<String, String> result = Map.of("token", tokenResponse.getBody().get("token").toString());
            return ResponseEntity.ok(result);
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Session not found"));
        }
    }
}
