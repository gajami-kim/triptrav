package com.www.triptrav.repository;

import com.www.triptrav.domain.ScheduleDTO;
import com.www.triptrav.domain.ScheduleVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

@Mapper
public interface ScheduleMapper {
    int insertPlan(ScheduleVO scheVO);

    List<ScheduleDTO> getSchedule(@Param("sco") long sco, @Param("date") int date);

    int updatePlanName(@Param("scheName") String scheName, @Param("sco") long sco);

    int insertMemo(@Param("i") int i, @Param("sco") long sco);

    int getMemoYN(long sco);

    void updateMemoYN(long sco);

    long getScheduleMaker(long sco);

    ScheduleVO getScheduleVO(long sco);

    List<ScheduleVO> getUserSchedule(long uno);
}
