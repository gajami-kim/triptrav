package com.www.triptrav.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;


@Service
public class InviteService {

    @Value("${invite.secret-key}")
    private String secretKey;

    private static final String ALGORITHM = "AES";
    private static final int AES_KEY_SIZE = 16; //AES-128사용 (16바이트 키)

    //AES 키 길이를 16,24,32 바이트로 고정
    private static byte[] fixedKey(String secretKey) {
        byte[] key = secretKey.getBytes(StandardCharsets.UTF_8);
        return Arrays.copyOf(key, AES_KEY_SIZE); //16바이트로 고정
    }

    //AES 암호화
    public static String encrypt(String data, String secretKey) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(fixedKey(secretKey), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        byte[] encrypted = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

        //URL-safe Base64 인코딩 적용
        return Base64.getUrlEncoder().withoutPadding().encodeToString(encrypted);
    }

    //AES 복호화
    public static String decrypt(String encryptedData, String secretKey) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(fixedKey(secretKey), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, keySpec);

        byte[] decodedData = Base64.getUrlDecoder().decode(encryptedData);
        byte[] originalData  = cipher.doFinal(decodedData);

        //URL-safe Base64 적용
        return new String(originalData, StandardCharsets.UTF_8);
    }

}
