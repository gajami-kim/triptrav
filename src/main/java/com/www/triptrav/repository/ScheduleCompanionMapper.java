package com.www.triptrav.repository;

import com.www.triptrav.domain.ScheduleCompanionDTO;
import com.www.triptrav.domain.ScheduleCompanionVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleCompanionMapper {
    int inviteUserAddPlan(@Param("uno") long uno, @Param("sco") long sco);

    List<ScheduleCompanionDTO> getCompanionList(long sco);

    int deleteCompanion(@Param("sco") long sco, @Param("uno") long uno);
}
