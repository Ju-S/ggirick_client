package com.kedu.ggirick_client_backend.utils;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import java.util.Date;

@Component
public class JWTUtil {

    @Value("${jwt.expiration}")
    private Long exp;

    private final Algorithm algorithm;
    private final JWTVerifier jwt;

    public JWTUtil(@Value("${jwt.secret}") String secret) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.jwt = JWT.require(algorithm).build();
    }

    public String createToken(UserTokenDTO userInfo) {
        return JWT.create()
                 .withSubject(userInfo.getId())
                 .withClaim("authority", userInfo.getAuthority())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + exp * 100))
                .sign(algorithm);
    }

    public DecodedJWT verifyToken(String token) {
        return jwt.verify(token);
    }
}
