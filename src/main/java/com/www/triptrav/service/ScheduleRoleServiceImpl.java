package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleRoleVO;
import com.www.triptrav.repository.ScheduleMapper;
import com.www.triptrav.repository.ScheduleRoleMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ScheduleRoleServiceImpl implements ScheduleRoleService{
    private final ScheduleRoleMapper scheduleRoleMapper;

    @Override
    public void insertRole(long sco, long uno, int i) {
        scheduleRoleMapper.insertPlanRole(sco, uno, 1);
    }

    @Override
    public int addScheduleRole(long uno, long sco) {
        return scheduleRoleMapper.addScheduleRole(uno, sco);
    }

    @Override
    public ScheduleRoleVO checkScheduleRole(long uno, long sco) {
        return scheduleRoleMapper.checkScheduleRole(uno, sco);
    }

    @Override
    public int updateRole(long uno, long sco, int roleValue) {
        return scheduleRoleMapper.updateRole(uno,sco,roleValue);
    }

    @Override
    public int deleteRole(long sco, long uno) {
        return scheduleRoleMapper.deleteRole(sco, uno);
    }
}
