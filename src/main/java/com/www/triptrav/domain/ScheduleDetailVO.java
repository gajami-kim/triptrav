package com.www.triptrav.domain;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ScheduleDetailVO {
    private long sco;
    private long scheContentId;
    private String scheTitle; //장소이름
    private int scheIndex;
    private int scheDate;
}
