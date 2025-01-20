package com.www.triptrav.domain;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReviewImageVO {
    private long riId;
    private long rno;
    private String imagePath;
    private String uploadDate;
}
