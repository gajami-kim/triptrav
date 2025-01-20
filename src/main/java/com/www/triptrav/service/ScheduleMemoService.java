package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleMemoVO;

public interface ScheduleMemoService {
    int insertMemoContent(String memo, long sco, String nick);

    ScheduleMemoVO getMemo(long sco);

    int modifyMemo(String memo, long sco);

    int deleteMemo(long sco);
}
