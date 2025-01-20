package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleCompanionDTO;
import com.www.triptrav.domain.ScheduleCompanionVO;

import java.util.List;

public interface ScheduleCompanionService {
    int inviteUserAddPlan(long uno, long sco);

    List<ScheduleCompanionDTO> getCompanionList(long sco);

    int deleteCompanion(long sco, long uno);
}
