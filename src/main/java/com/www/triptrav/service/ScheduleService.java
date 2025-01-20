package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleDTO;
import com.www.triptrav.domain.ScheduleVO;

import java.util.List;

public interface ScheduleService {
    int insertPlan(ScheduleVO scheVO, long contentId);

    List<ScheduleDTO> getSchedule(long sco, int date);

    int updatePlanName(String scheName, long sco);

    int insertMemo(int i, long sco);

    int getMemoYN(long sco);

    void updateMemoYN(long sco);

    long getScheduleMaker(long sco);

    ScheduleVO getScheduleVO(long sco);

    List<ScheduleVO> getUserSchedule(long uno);
}
