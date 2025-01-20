package com.www.triptrav.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRoleVO {
    private long sco;
    private long uno;
    private int scheRole;

    public ScheduleRoleVO(long sco, long uno) {
        this.sco = sco;
        this.uno = uno;
    }
}
