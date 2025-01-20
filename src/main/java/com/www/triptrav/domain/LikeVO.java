package com.www.triptrav.domain;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LikeVO {
    private long uno;
    private long likeCode;
    private String likeName;
    private long typeId; // 찜한 장소인지 찜한 여행인지 구분 인자
}
