package com.www.triptrav.repository;

import com.www.triptrav.domain.ScheduleMemoVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ScheduleMemoMapper {
    int insertMemoContent(@Param("memo") String memo, @Param("sco") long sco, @Param("nick") String nick);

    ScheduleMemoVO getMemo(long sco);

    int modifyMemo(@Param("memo") String memo, @Param("sco") long sco);

    int deleteMemo(long sco);
}
