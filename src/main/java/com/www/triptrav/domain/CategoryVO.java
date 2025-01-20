package com.www.triptrav.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryVO {
    private int categoryId;
    private String categoryCode;
    private String categoryName;
}
