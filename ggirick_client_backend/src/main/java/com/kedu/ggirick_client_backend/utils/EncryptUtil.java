package com.kedu.ggirick_client_backend.utils;

import com.kedu.ggirick_client_backend.config.EncryptConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class EncryptUtil {
    private final EncryptConfig config;

    private static final int ITERATION_COUNT = 1000;

    public  String encrypt(String plaintext) throws Exception {
        byte[] saltBytes = config.getSalt().getBytes("UTF-8");

        PBEKeySpec keySpec = new PBEKeySpec(config.getSecretKey().toCharArray());
        SecretKey key = SecretKeyFactory.getInstance("PBEWithMD5AndDES").generateSecret(keySpec);

        PBEParameterSpec paramSpec = new PBEParameterSpec(saltBytes, ITERATION_COUNT);
        Cipher cipher = Cipher.getInstance("PBEWithMD5AndDES");
        cipher.init(Cipher.ENCRYPT_MODE, key, paramSpec);

        byte[] encrypted = cipher.doFinal(plaintext.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public String decrypt(String ciphertext) throws Exception {
        byte[] saltBytes = config.getSalt().getBytes();

        PBEKeySpec keySpec = new PBEKeySpec(config.getSecretKey().toCharArray());
        SecretKey key = SecretKeyFactory.getInstance("PBEWithMD5AndDES").generateSecret(keySpec);

        PBEParameterSpec paramSpec = new PBEParameterSpec(saltBytes, ITERATION_COUNT);
        Cipher cipher = Cipher.getInstance("PBEWithMD5AndDES");
        cipher.init(Cipher.DECRYPT_MODE, key, paramSpec);

        byte[] decoded = Base64.getDecoder().decode(ciphertext);
        return new String(cipher.doFinal(decoded));
    }
}