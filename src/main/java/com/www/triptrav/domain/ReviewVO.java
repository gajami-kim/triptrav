package com.www.triptrav.domain;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReviewVO {
    private long rno;
    private long uno;
    private String nickname;
    private float reRate;
    private String reContent;
    private int reImageCount;
    private String reDate;
    private long reUseful;
    private int reReport;
    private long reContentId;
    private long reContentType;
    private String reContentName;
}
