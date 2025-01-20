package com.www.triptrav.service;

import com.www.triptrav.domain.ScheduleMemoVO;
import com.www.triptrav.repository.ScheduleMemoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ScheduleMemoServiceImpl implements ScheduleMemoService {
    private final ScheduleMemoMapper scheduleMemoMapper;

    @Override
    public int insertMemoContent(String memo, long sco, String nick) {
        return scheduleMemoMapper.insertMemoContent(memo, sco, nick);
    }

    @Override
    public ScheduleMemoVO getMemo(long sco) {
        return scheduleMemoMapper.getMemo(sco);
    }

    @Override
    public int modifyMemo(String memo, long sco) {
        return scheduleMemoMapper.modifyMemo(memo, sco);
    }

    @Override
    public int deleteMemo(long sco) {
        return scheduleMemoMapper.deleteMemo(sco);
    }
}
