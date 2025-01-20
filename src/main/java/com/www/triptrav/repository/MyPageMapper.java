package com.www.triptrav.repository;

import com.www.triptrav.domain.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MyPageMapper {
    UserVO isSocial(long uno);

    List<ScheduleVO> scheduleCall(long uno);

    List<ReviewVO> getReviewList(long uno);

    List<ReviewImageVO> getReviewDTOList(long uno);

    ReviewVO getPopReview(long rno);

    ScheduleDetailVO getScheduleDetail(long sco);

    int userComNPw(UserVO userVO);

    int userComYPw(UserVO userVO);

    int userSocialUpdate(UserVO userVO);

    List<String> getComList(long uno);

    ScheduleVO scheduleComCall(String sco);

    int scheduleDelete(long sco);

    List<LikeVO> getLikePlace(LikeVO lvo);

    int getRole(ScheduleRoleVO srvo);

    int delLike(LikeVO likeVO);
}
