package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleCompanionDTO;
import com.www.triptrav.domain.ScheduleCompanionVO;
import com.www.triptrav.repository.ScheduleCompanionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleCompanionServiceImpl implements ScheduleCompanionService{
    private final ScheduleCompanionMapper scheduleCompanionMapper;

    @Override
    public int inviteUserAddPlan(long uno, long sco) {
        return scheduleCompanionMapper.inviteUserAddPlan(uno, sco);
    }

    @Override
    public List<ScheduleCompanionDTO> getCompanionList(long sco) {
        return scheduleCompanionMapper.getCompanionList(sco);
    }

    @Override
    public int deleteCompanion(long sco, long uno) {
        return scheduleCompanionMapper.deleteCompanion(sco,uno);
    }
}
