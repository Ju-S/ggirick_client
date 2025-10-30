package com.kedu.ggirick_client_backend.controllers.chat;


import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.services.hr.EmployeeService;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/openvidu")
public class OpenviduChatController {

    @Value("${LIVEKIT_API_KEY}")
    private String apiKey;

    @Value("${LIVEKIT_API_SECRET}")
    private String apiSecret;

    @Autowired
    private EmployeeService employeeService;



    @PostMapping(value = "/token")
    public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, String> params, @AuthenticationPrincipal UserTokenDTO userInfo) {
        String roomName = params.get("roomName");
        String participantName = employeeService.getEmployeeInfo(userInfo.getId()).getName();

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        AccessToken token = new AccessToken(apiKey, apiSecret);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));

        log.info("Creating token for {}", participantName);

        return ResponseEntity.ok(Map.of("token", token.toJwt()));
    }

    @PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
    public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader, @RequestBody String body) {
        WebhookReceiver webhookReceiver = new WebhookReceiver(apiKey, apiSecret);
        try {
            LivekitWebhook.WebhookEvent event = webhookReceiver.receive(body, authHeader);
            System.out.println("LiveKit Webhook: " + event.toString());
        } catch (Exception e) {
            System.err.println("Error validating webhook event: " + e.getMessage());
        }
        return ResponseEntity.ok("ok");
    }



}
