package com.www.triptrav.service;

import com.www.triptrav.domain.UserVO;

public interface UserService{
    void joinUser(UserVO uvo);

    UserVO checkEmail(String email);

    int duplicationNick(String nickName);

    int duplicationEmail(String email);

    int findUserPw(String email);

    String getPath(String uno);

    String getUserNick(long uno);

    int addAdditionalInfo(UserVO uvo);

    boolean checkAdditionalInfo(long unoNum);

    UserVO getUvo(long unoNum);

    void insertTestUsersIfEmpty();
}
