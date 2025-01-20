package com.www.triptrav.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserVO {
    private long uno;
    private String email;
    private String nickname;
    private String pw;
    private String profile;
    private String provider;
    private String providerId;
    private Integer gender;
    private int age;
    private List<AuthVO> authList;
}