package com.www.triptrav.service;


import com.www.triptrav.domain.*;
import org.apache.catalina.User;

import java.util.List;

public interface MyPageService {
    UserVO isSocial(long uno);

    List<ScheduleVO> scheduleCall(long uno);

    List<ReviewVO> getReviewList(long uno);

    List<ReviewImageVO> getReviewDTOList(long uno);

    ReviewVO getPopReview(long rno);

    ScheduleDetailVO getScheduleDetail(long sco);

    int updateCommonUser(UserVO userVO);

    int updateSocialUserName(UserVO userVO);

    int scheduleDelete(long sco);

    List<LikeVO> getLikePlace(LikeVO lvo);

    int getRole(ScheduleRoleVO roleVO);

    int delLike(LikeVO likeVO);
}
