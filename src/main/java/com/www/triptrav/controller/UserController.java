package com.www.triptrav.controller;

import com.www.triptrav.domain.LikeVO;
import com.www.triptrav.domain.UserVO;
import com.www.triptrav.service.MailService;
import com.www.triptrav.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/user/*")
@RequiredArgsConstructor
@Slf4j
@Controller
public class UserController {

    private final UserService usv;
    private final MailService msv;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/join")
    public String joinUser(UserVO uvo, Model m){
        log.info("user join start!");
        log.info("join user >>> {}", uvo);
        uvo.setPw(passwordEncoder.encode(uvo.getPw()));
        usv.joinUser(uvo);
        m.addAttribute("joinMsg","가입이 완료되었습니다!");
        return "redirect:/?joinMsg=true";
    }

    @GetMapping("/login")
    public void loginUser(){
    }


    @GetMapping("/join")
    public void joinUser(){
    }

    @GetMapping("/findPw")
    public void findPw(){
    }

    @PostMapping(value="/nick",consumes = "text/plain", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> duplicationNick(@RequestBody String nickName){
        int isOk = usv.duplicationNick(nickName);
        return isOk==0? new ResponseEntity<String>("0", HttpStatus.OK):
                new ResponseEntity<String>("1",HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(value="/email",consumes = "text/plain", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> duplicationEmail(@RequestBody String email){
        log.info("email>>>>{}",email);
        int isOk = usv.duplicationEmail(email);
        return isOk==0? new ResponseEntity<String>("0", HttpStatus.OK):
                new ResponseEntity<String>("1",HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //비밀번호 찾기
    @PostMapping("/find/{email}")
    @ResponseBody
    public String findUserPw(@PathVariable("email")String email){
        if(usv.findUserPw(email)>0){
            msv.sendNewPw(email);
            return "1";
        }
        return "0";
    }

    @GetMapping("/profile/{unoValue}")
    @ResponseBody
    public String getProfile(@PathVariable("unoValue")String uno) {
        return usv.getPath(uno);
    }

    @PostMapping("/additionalInfo")
    @ResponseBody
    public String addAdditionalInfo(@ModelAttribute UserVO uvo){
        int isUpdate = usv.addAdditionalInfo(uvo);
        if(isUpdate > 0){
            return "success";
        }
        return "fail";
    }
    @GetMapping("/checkAdditionalInfo/{unoNum}")
    @ResponseBody
    public Boolean checkAdditionalInfo(@PathVariable long unoNum){
        return usv.checkAdditionalInfo(unoNum);
    }

    @GetMapping("/getAdditionalInfo/{unoNum}")
    @ResponseBody
    public UserVO getAdditionalInfo(@PathVariable long unoNum){
        return usv.getUvo(unoNum);
    }
}
