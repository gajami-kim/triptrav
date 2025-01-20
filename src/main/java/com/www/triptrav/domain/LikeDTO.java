package com.www.triptrav.domain;


import lombok.*;
import org.springframework.data.relational.core.sql.Like;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LikeDTO {
    private LikeVO like;
    private String firstImage;
    private long contentTypeId;
    private String title;
}
