package com.www.triptrav.domain;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReviewReportVO {
    private long rrId;
    private long rno;
    private long uno;
    private String reportReason;
}
