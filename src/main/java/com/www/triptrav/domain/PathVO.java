package com.www.triptrav.domain;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PathVO {
    private long contentId;
    private String firstImage;
    private long contentTypeId;
    private String title;
    private String addr1;

    public PathVO(long contentid, String firstimage, long contenttypeid) {
        this.contentId = contentid;
        this.firstImage = firstimage;
        this.contentTypeId = contenttypeid;
    }
}
