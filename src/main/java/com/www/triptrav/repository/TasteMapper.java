package com.www.triptrav.repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface TasteMapper {
    int checkData(String uno);

    int deleteTasteDataByUno(String uno);

    int insertTasteData(String uno, Integer cno);

    void insertTaste(long uno, int cno);

    List<Map<String, Object>> getTrend(int age, int gender);
}
