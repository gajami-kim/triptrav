package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleDTO;
import com.www.triptrav.domain.ScheduleDetailVO;
import com.www.triptrav.repository.ScheduleDetailMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleDetailServiceImpl implements ScheduleDetailService{
    private final ScheduleDetailMapper scheduleDetailMapper;


    @Override
    public void insertDetailPlan(long sco, long contentId, int i, int j, String placeTitle) {
        scheduleDetailMapper.insertDetailPlan(sco, contentId, i, j, placeTitle);
    }

    @Override
    public void updatePlan(ScheduleDTO scheDTO) {
        scheduleDetailMapper.updatePlan(scheDTO);
    }

    @Override
    public List<ScheduleDetailVO> getPlanDate(long sco, int date) {
        return scheduleDetailMapper.getPlanDate(sco, date);
    }

    @Override
    public void emptyPlan(long sco, int sche_date) {
        scheduleDetailMapper.emptyPlan(sco, sche_date);
    }

    @Override
    public List<ScheduleDetailVO> getAllCourse(long sco) {
        return scheduleDetailMapper.getAllCourse(sco);
    }

    @Override
    public int addPlaceInPlan(ScheduleDetailVO sdVO) {
        return scheduleDetailMapper.addPlaceInPlan(sdVO);
    }

    @Override
    public int getMaxDate(long sco) {
        return scheduleDetailMapper.getMaxDate(sco);
    }

    @Override
    public int getMaxIndex(long sco, int date) {
        return scheduleDetailMapper.getMaxIndex(sco, date);
    }
}
