package com.www.triptrav.config.oauth2.provider;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo{

    private Map<String,Object> attributes;

    public NaverUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }


    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getProviderId() {
        return (String)((Map) attributes.get("response")).get("id");
    }

    @Override
    public String getEmail() {
        return (String)((Map) attributes.get("response")).get("email");
    }

    @Override
    public String getName() {
        return (String)((Map) attributes.get("response")).get("name");
    }

    @Override
    public String getProfile() {
        return (String)((Map)attributes.get("response")).get("profile_image");
    }
}
