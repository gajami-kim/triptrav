package com.www.triptrav.service;

import com.www.triptrav.repository.TasteMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TasteServiceImpl implements TasteService {
    private final TasteMapper tasteMapper;

    @Override
    public int checkData(String uno) {
        return tasteMapper.checkData(uno);
    }

    @Override
    @Transactional
    public int updateData(List<Integer> cnoList, String uno) {
        int rowsDeleted = tasteMapper.deleteTasteDataByUno(uno);
        int rowsInserted = 0;
        for (Integer cno : cnoList) {
            rowsInserted += tasteMapper.insertTasteData(uno, cno);
        }
        return rowsInserted;
    }

    @Override
    public int insertData(List<Integer> cnoList, String uno) {
        int rowsInserted = 0;
        for (Integer cno : cnoList) {
            rowsInserted += tasteMapper.insertTasteData(uno, cno);
        }
        return rowsInserted;
    }

    @Override
    public List<Map<String, Object>> getTrend(int age, int gender) {
        return tasteMapper.getTrend(age, gender);
    }

}
