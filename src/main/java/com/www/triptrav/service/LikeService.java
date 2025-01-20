package com.www.triptrav.service;

import com.www.triptrav.domain.LikeVO;

import java.util.List;

public interface LikeService {

    int addLike(LikeVO likeVO);

    int likeStatus(long uno, long likeCode);

    int deleteLike(LikeVO likeVO);

    List<LikeVO> getLikeList(long unoNum);
}
