package com.www.triptrav.repository;

import com.www.triptrav.domain.ScheduleRoleVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.relational.core.sql.In;

@Mapper
public interface ScheduleRoleMapper {
    void insertPlanRole(@Param("sco") long sco, @Param("uno") long uno, @Param("i") int i);

    int addScheduleRole(@Param("uno") long uno, @Param("sco") long sco);

    ScheduleRoleVO checkScheduleRole(@Param("uno") long uno, @Param("sco") long sco);

    int updateRole(@Param("uno") long uno, @Param("sco") long sco, @Param("roleValue") int roleValue);

    int deleteRole(@Param("sco") long sco, @Param("uno") long uno);
}
