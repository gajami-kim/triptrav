package com.www.triptrav.service;

import com.www.triptrav.domain.ReviewReportVO;
import com.www.triptrav.domain.ReviewVO;
import com.www.triptrav.repository.ReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final ReviewMapper reviewMapper;

    @Override
    public int post(ReviewVO rvo) {
        return reviewMapper.post(rvo);
    }

    @Override
    public void saveReviewImage(long rno, String imagePath) {
        reviewMapper.insertReviewImage(rno, imagePath);
    }

    @Override
    public List<ReviewVO> getList(long contentId) {
        return reviewMapper.getList(contentId);
    }

    @Override
    public List<String> getImagePathsByReviewId(long rno) {
        return reviewMapper.getImagePathsByReviewId(rno);
    }

    @Override
    public int getCount(String contentId) {
        return reviewMapper.getCount(contentId);
    }

    @Override
    public int checkReviewLike(String rno, String uno) {
        return reviewMapper.checkReviewLike(rno, uno);
    }

    @Override
    public int clickLike(String rno, String uno) {
        return reviewMapper.clickLike(rno,uno);
    }

    @Override
    public int unClickLike(String rno, String uno) {
        return reviewMapper.unClickLike(rno,uno);
    }

    @Override
    public int getLikeCount(String rno) {
        return reviewMapper.getLikeCount(rno);
    }

    @Override
    public void plusCount(String rno) {
        reviewMapper.plusCount(rno);
    }

    @Override
    public void minusCount(String rno) {
        reviewMapper.minusCount(rno);
    }

    @Override
    public int put(ReviewVO rvo) {
        return reviewMapper.put(rvo);
    }

    @Override
    public void delete(String rno) {
        reviewMapper.delete(rno);
    }

    @Override
    public void removeAllImagePath(long rno) {
        reviewMapper.removeAllImagePath(rno);
    }

    @Override
    public int getPlaceScore(String contentId) {
        return reviewMapper.getPlaceScore(contentId);
    }

    @Override
    public int saveReport(ReviewReportVO reviewReportVO) {
        return reviewMapper.saveReport(reviewReportVO);
    }

    @Override
    public int checkReport(long rno, long uno) {
        return reviewMapper.checkReport(rno, uno);
    }

    @Override
    public void updateReportCount(long rno) {
        reviewMapper.updateReportCount(rno);
    }

    @Override
    public int getReportCount(long rno) {
        return reviewMapper.getReportCount(rno);
    }

}
