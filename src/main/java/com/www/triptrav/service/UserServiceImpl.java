package com.www.triptrav.service;

import com.www.triptrav.domain.UserVO;
import com.www.triptrav.repository.TasteMapper;
import com.www.triptrav.repository.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final TasteMapper tasteMapper;

    @Override
    public void joinUser(UserVO uvo) {
        int isOk = userMapper.joinUser(uvo);
        if (isOk == 1) {
            long uno = uvo.getUno();
            if (uno != 0) {
                userMapper.insertAuth(uno);
            } else {
                long insertedUno = userMapper.getInsertedUno(uvo.getEmail());
                if (insertedUno != 0) {
                    userMapper.insertAuth(insertedUno);
                } else {
                    log.error("uno 값이 존재하지 않습니다. 가입 실패!");
                }
            }
        } else {
            log.error("회원가입에 실패하였습니다.");
        }
    }

    @Override
    public UserVO checkEmail (String email){
        UserVO user = userMapper.checkEmail(email);
        if (user != null) {
            user.setAuthList(userMapper.selectAuth(email));
            return user;
        }
        return null;
    }

    @Override
    public int duplicationNick(String nickName) {
        return userMapper.duplicationNick(nickName);
    }

    @Override
    public int duplicationEmail(String email) {
        return userMapper.duplicationEmail(email);
    }

    @Override
    public int findUserPw(String email) {
        return userMapper.findUserPw(email);
    }

    @Override
    public String getPath(String uno) {
        return userMapper.getPath(uno);
    }

    @Override
    public String getUserNick(long uno) {
        return userMapper.getUserNick(uno);
    }

    @Override
    public int addAdditionalInfo(UserVO uvo) {
        return userMapper.addAdditionalInfo(uvo);
    }

    @Override
    public boolean checkAdditionalInfo(long unoNum) {
        return userMapper.checkAdditionalInfo(unoNum);
    }

    @Override
    public UserVO getUvo(long unoNum) {
        return userMapper.getUvo(unoNum);
    }


    public void insertTestUsersIfEmpty() {
        Random random = new Random();
        if (userMapper.getUserCount() == 0) {
            for (int i = 1; i <= 500; i++) {
                UserVO user = new UserVO();
                user.setEmail("user" + i + "@example.com");
                user.setNickname("user"+i);
                user.setAge(random.nextInt(99) + 1);
                user.setGender(random.nextInt(2));
                userMapper.insertUser(user);
                long uno = user.getUno();
                int numberOfTastes = random.nextInt(5) + 1;
                for (int j = 0; j < numberOfTastes; j++) {
                    int cno = random.nextInt(30) + 1;
                    tasteMapper.insertTaste(uno, cno);
                }
            }
        }
    }
}

