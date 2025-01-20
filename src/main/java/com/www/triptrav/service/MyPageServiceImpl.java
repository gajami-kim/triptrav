package com.www.triptrav.service;

import com.www.triptrav.domain.*;
import com.www.triptrav.repository.MyPageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageMapper myPageMapper;

    @Override
    public UserVO isSocial(long uno) {
        return  myPageMapper.isSocial(uno);
    }

    @Override
    public List<ScheduleVO> scheduleCall(long uno) {
        List<ScheduleVO> scheList = myPageMapper.scheduleCall(uno);
        List<String> comList = myPageMapper.getComList(uno);
        for(String sco : comList){
            ScheduleVO scheduleVO = myPageMapper.scheduleComCall(sco);
            scheList.add(scheduleVO);
        }
        return scheList;
    }

    @Override
    public List<ReviewVO> getReviewList(long uno) {
        return myPageMapper.getReviewList(uno);
    }

    @Override
    public List<ReviewImageVO> getReviewDTOList(long uno) {
        return myPageMapper.getReviewDTOList(uno);
    }

    @Override
    public ReviewVO getPopReview(long rno) {
        return myPageMapper.getPopReview(rno);
    }

    @Override
    public ScheduleDetailVO getScheduleDetail(long sco) {
        return myPageMapper.getScheduleDetail(sco);
    }

    @Override
    public int updateCommonUser(UserVO userVO) {
        log.info("userVo22222 => {}", userVO.getPw());
        int isOk = 0;
        if (userVO.getPw() == null || userVO.getPw().isEmpty()) {
            isOk = myPageMapper.userComNPw(userVO);  // 비밀번호 없는 업데이트
        } else {
            isOk = myPageMapper.userComYPw(userVO);  // 비밀번호 포함 업데이트
        }
        return isOk;
    }

    @Override
    public int updateSocialUserName(UserVO userVO) {
        int isOk = 0;
        isOk = myPageMapper.userSocialUpdate(userVO);
        return isOk;
    }

    @Override
    public int scheduleDelete(long sco) {
        int isOk = 0;
        isOk = myPageMapper.scheduleDelete(sco);
        return isOk;
    }

    @Override
    public List<LikeVO> getLikePlace(LikeVO lvo) {
        return myPageMapper.getLikePlace(lvo);
    }

    @Override
    public int getRole(ScheduleRoleVO srvo) {
        return myPageMapper.getRole(srvo);
    }

    @Override
    public int delLike(LikeVO likeVO) {
        return myPageMapper.delLike(likeVO);
    }
}
