package com.www.triptrav.service;

import com.www.triptrav.domain.LikeVO;
import java.util.List;

public interface TripService {

    List<String> getLikeList(long uno);

    int delLike(LikeVO like);

    int addLike(LikeVO like);
}
