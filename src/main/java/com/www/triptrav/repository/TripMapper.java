package com.www.triptrav.repository;


import com.www.triptrav.domain.LikeVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TripMapper {

    List<String> getLikeList(long uno);

    int addLike(LikeVO like);

    int deleteLike(LikeVO like);
}
