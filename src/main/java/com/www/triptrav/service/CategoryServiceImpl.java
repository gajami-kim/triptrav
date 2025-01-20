package com.www.triptrav.service;

import com.www.triptrav.domain.CategoryVO;
import com.www.triptrav.repository.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final CategoryMapper categoryMapper;

    @Override
    public List<Integer> getCategoryCodes(List<String> categoryNames) {
        List<Integer> cnoList = categoryMapper.findCategoriesByNames(categoryNames);
        return cnoList;
    }
}
