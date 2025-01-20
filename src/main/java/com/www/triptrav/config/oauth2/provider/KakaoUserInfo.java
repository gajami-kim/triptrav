package com.www.triptrav.config.oauth2.provider;

import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo{

    private Map<String,Object> attributes;

    public KakaoUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {
        return attributes.get("id").toString();
    }

    @Override
    public String getEmail() {
        return (String)((Map) attributes.get("kakao_account")).get("email");
    }

    @Override
    public String getName() {
        return (String)((Map) attributes.get("properties")).get("nickname");
    }

    @Override
    public String getProfile() {
        return (String)((Map)attributes.get("properties")).get("profile_image");
    }
}
