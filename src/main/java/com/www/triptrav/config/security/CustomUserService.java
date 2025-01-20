package com.www.triptrav.config.security;

import com.www.triptrav.config.oauth2.PrincipalDetails;
import com.www.triptrav.domain.UserVO;
import com.www.triptrav.repository.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class CustomUserService implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserVO uvo = userMapper.checkEmail(email);

        if (uvo == null) {
            throw new UsernameNotFoundException("해당 이메일로 유저를 찾을 수 없슴! > > " + email);
        }

        uvo.setAuthList(userMapper.selectAuth(email));
        return new PrincipalDetails(uvo);
    }
}
