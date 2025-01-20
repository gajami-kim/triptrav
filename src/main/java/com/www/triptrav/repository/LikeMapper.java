package com.www.triptrav.repository;

import com.www.triptrav.domain.LikeVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LikeMapper {

    int addLike(LikeVO likeVO);

    int likeStatus(long uno, long likeCode);

    int deleteLike(LikeVO likeVO);

    List<LikeVO> getLikeList(long unoNum);
}
