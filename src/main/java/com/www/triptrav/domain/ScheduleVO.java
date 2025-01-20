package com.www.triptrav.domain;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ScheduleVO {
    private long sco;
    private long uno;
    private String scheName;
    private String scheStart;
    private String scheEnd;
    private int scheCount; //여행소요일수
    private String scheMemo;
    private String scheImg;
}
