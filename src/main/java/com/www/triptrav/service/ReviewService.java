package com.www.triptrav.service;

import com.www.triptrav.domain.ReviewReportVO;
import com.www.triptrav.domain.ReviewVO;

import java.util.List;

public interface ReviewService {
    int post(ReviewVO rvo);

    void saveReviewImage(long rno, String imagePath);

    List<ReviewVO> getList(long contentId);

    List<String> getImagePathsByReviewId(long rno);

    int getCount(String contentId);

    int checkReviewLike(String rno, String uno);

    int clickLike(String rno, String uno);

    int unClickLike(String rno, String uno);

    int getLikeCount(String rno);

    void plusCount(String rno);

    void minusCount(String rno);

    int put(ReviewVO rvo);

    void delete(String rno);

    void removeAllImagePath(long rno);

    int getPlaceScore(String contentId);

    int saveReport(ReviewReportVO reviewReportVO);

    int checkReport(long rno, long uno);

    void updateReportCount(long rno);

    int getReportCount(long rno);
}

