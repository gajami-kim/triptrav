package com.www.triptrav.service;

import com.www.triptrav.repository.UserMapper;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
@Getter
public class MailService {
    private final JavaMailSender sender;
    private static final String fromEmail = "ohe991016@gmail.com";
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public void sendNewPw(String email) {
        MimeMessage message = sender.createMimeMessage();
        try{
            String tmpPw = getTempPassword();
            message.setFrom(new InternetAddress(fromEmail,"TripTrav"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("[TripTrav] 임시 비밀번호 발급 안내입니다.");
            String text = "<html><body>" +
                    "<h2>TripTrav 임시 비밀번호 발급</h2>" +
                    "<p>아래의 비밀번호로 다시 로그인 해주세요.</p>" +
                    "<h1>"+tmpPw+"</h1>" +
                    "<p>홈페이지 접속 후 비밀번호를 변경해주세요.</p>" +
                    "</body></html>";
            message.setContent(text, "text/html;charset=utf-8");

            sender.send(message);

            String newPw = passwordEncoder.encode(tmpPw);
            userMapper.updatePw(email,newPw);
        } catch (MessagingException | UnsupportedEncodingException e){
            e.printStackTrace();
        }
    }

    public String getTempPassword(){
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };

        String tmppw = "";

        int idx = 0;
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            tmppw += charSet[idx];
        }
        return tmppw;
    }
}
