package com.www.triptrav.service;

import com.www.triptrav.domain.LikeVO;
import com.www.triptrav.repository.TripMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

     private final TripMapper tripMapper;

    @Override
    public List<String> getLikeList(long uno) {
        return tripMapper.getLikeList(uno);
    }

    @Override
    public int delLike(LikeVO like) {
        return tripMapper.deleteLike(like);
    }

    @Override
    public int addLike(LikeVO like){
        return tripMapper.addLike(like);
    }
}
