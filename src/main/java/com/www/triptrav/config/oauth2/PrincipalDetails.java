package com.www.triptrav.config.oauth2;

import com.www.triptrav.domain.UserVO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class PrincipalDetails implements UserDetails, OAuth2User {
    public UserVO userVO;
    private Map<String, Object> attributes;

    // 일반
    public PrincipalDetails(UserVO userVO) {
        this.userVO = userVO;
    }

    // 소셜
    public PrincipalDetails(UserVO userVO, Map<String, Object> attributes) {
        this.userVO = userVO;
        this.attributes = attributes;

    }

    @Override
    public String getName() {
        return userVO.getNickname();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return userVO.getPw();
    }

    @Override
    public String getUsername() {
        return userVO.getEmail();
    }

    public UserVO getUser() {
        return userVO;
    }
}
