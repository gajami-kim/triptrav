package com.www.triptrav.service;

import com.www.triptrav.domain.LikeVO;
import com.www.triptrav.repository.LikeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService{

    private final LikeMapper likeMapper;

    @Override
    public int addLike(LikeVO likeVO) {
        return likeMapper.addLike(likeVO);
    }

    @Override
    public int likeStatus(long uno, long likeCode) {
        return likeMapper.likeStatus(uno,likeCode);
    }

    @Override
    public int deleteLike(LikeVO likeVO) {
        return likeMapper.deleteLike(likeVO);
    }

    @Override
    public List<LikeVO> getLikeList(long unoNum) {
        return likeMapper.getLikeList(unoNum);
    }
}
