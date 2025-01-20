package com.www.triptrav.repository;

import com.www.triptrav.domain.CategoryVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Integer> findCategoriesByNames(List<String> categoryNames);
}
