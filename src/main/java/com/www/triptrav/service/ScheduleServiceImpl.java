package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleDTO;
import com.www.triptrav.domain.ScheduleVO;
import com.www.triptrav.repository.ScheduleMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {
    private final ScheduleMapper scheduleMapper;

    @Override
    public int insertPlan(ScheduleVO scheVO, long contentId) {
        return scheduleMapper.insertPlan(scheVO);
    }

    @Override
    public List<ScheduleDTO> getSchedule(long sco, int date) {
        return scheduleMapper.getSchedule(sco, date);
    }

    @Override
    public int updatePlanName(String scheName, long sco) {
        return scheduleMapper.updatePlanName(scheName, sco);
    }

    @Override
    public int insertMemo(int i, long sco) {
        return scheduleMapper.insertMemo(i, sco);
    }

    @Override
    public int getMemoYN(long sco) {
        return scheduleMapper.getMemoYN(sco);
    }

    @Override
    public void updateMemoYN(long sco) {
        scheduleMapper.updateMemoYN(sco);
    }

    @Override
    public long getScheduleMaker(long sco) {
        return scheduleMapper.getScheduleMaker(sco);
    }

    @Override
    public ScheduleVO getScheduleVO(long sco) {
        return scheduleMapper.getScheduleVO(sco);
    }

    @Override
    public List<ScheduleVO> getUserSchedule(long uno) {
        return scheduleMapper.getUserSchedule(uno);
    }

}
