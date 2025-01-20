package com.www.triptrav.service;

import java.util.List;
import java.util.Map;

public interface TasteService {
    int checkData(String uno);

    int updateData(List<Integer> cnoList, String uno);

    int insertData(List<Integer> cnoList, String uno);

    List<Map<String, Object>> getTrend(int age, int gender);
}
