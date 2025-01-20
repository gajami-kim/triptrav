package com.www.triptrav.controller;

import com.www.triptrav.domain.ReviewDTO;
import com.www.triptrav.domain.ReviewReportVO;
import com.www.triptrav.domain.ReviewVO;
import com.www.triptrav.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping("/review/*")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {

    private final ReviewService rsv;

    @PostMapping("/POST")
    @ResponseBody
    @Transactional
    public String writeReview(@RequestParam(value = "images", required = false) MultipartFile[] files,
                              @RequestParam("uno") long uno,
                              @RequestParam("nickname") String nickname,
                              @RequestParam("reRate") float reRate,
                              @RequestParam("reContent") String reContent,
                              @RequestParam("reImageCount") int reImageCount,
                              @RequestParam("reContentId") long reContentId,
                              @RequestParam("reContentType") long reContentType,
                              @RequestParam("reContentName") String reContentName) throws IOException {
        ReviewVO rvo = new ReviewVO();
        rvo.setUno(uno);
        rvo.setNickname(nickname);
        rvo.setReRate(reRate);
        rvo.setReContent(reContent);
        rvo.setReImageCount(reImageCount);
        rvo.setReContentId(reContentId);
        rvo.setReContentType(reContentType);
        rvo.setReContentName(reContentName);

        int isPost = rsv.post(rvo);
        if (isPost > 0) {
            if (files != null && files.length > 0) {
                String uploadFolder = "C:/userImage";
                SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd");
                String dateFolder = sdf.format(new Date());
                File uploadPath = new File(uploadFolder, dateFolder);
                if (!uploadPath.exists()) {
                    uploadPath.mkdirs();
                }

                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String uuid = UUID.randomUUID().toString();
                        String originalFilename = file.getOriginalFilename();
                        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                        String savedFilename = uuid + extension;
                        Path savePath = Paths.get(uploadPath.getAbsolutePath(), savedFilename);
                        file.transferTo(savePath.toFile());
                        rsv.saveReviewImage(rvo.getRno(), savePath.toString());
                    }
                }
                return "imageSuccess";
            }
        } else {
            return "fail";
        }
        return "success";
    }
    @PutMapping("/reviewUpdate/PUT")
    @ResponseBody
    @Transactional
    public String updateReview(@RequestParam(value = "images", required = false) MultipartFile[] files,
                               @RequestParam("uno") long uno,
                               @RequestParam("nickname") String nickname,
                               @RequestParam("reRate") float reRate,
                               @RequestParam("reContent") String reContent,
                               @RequestParam("reImageCount") int reImageCount,
                               @RequestParam("reContentId") long reContentId,
                               @RequestParam("reContentType") long reContentType,
                               @RequestParam("reContentName") String reContentName,
                               @RequestParam("rno") long rno
                               ) throws IOException {
        ReviewVO rvo = new ReviewVO();
        rvo.setUno(uno);
        rvo.setNickname(nickname);
        rvo.setReRate(reRate);
        rvo.setReContent(reContent);
        rvo.setReImageCount(reImageCount);
        rvo.setReContentId(reContentId);
        rvo.setReContentType(reContentType);
        rvo.setReContentName(reContentName);
        rvo.setRno(rno);

        rsv.removeAllImagePath(rvo.getRno());
        if (files != null && files.length > 0) {
            String uploadFolder = "C:/userImage";
            SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd");
            String dateFolder = sdf.format(new Date());
            File uploadPath = new File(uploadFolder, dateFolder);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    log.info("이미지처리{}", file.getName());
                    String uuid = UUID.randomUUID().toString();
                    String originalFilename = file.getOriginalFilename();
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String savedFilename = uuid + extension;
                    Path savePath = Paths.get(uploadPath.getAbsolutePath(), savedFilename);
                    file.transferTo(savePath.toFile());
                    rsv.saveReviewImage(rvo.getRno(), savePath.toString());
                }
            }
        }

        int isUpdate = rsv.put(rvo);
        if (isUpdate > 0) {
            return "success";
        } else {
            return "fail";
        }
    }
    @DeleteMapping("/reviewDelete/{rno}")
    @ResponseBody
    public void deleteReview(@PathVariable String rno){
        rsv.delete(rno);
    }

    @GetMapping("/GET/{contentId}")
    @ResponseBody
    public List<ReviewDTO> getReviewList(@PathVariable("contentId") long contentId) {
        List<ReviewVO> reviewList = rsv.getList(contentId);
        List<ReviewDTO> reviewDTOList = new ArrayList<>();
        for (ReviewVO review : reviewList) {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setReview(review);
            if (review.getReImageCount() > 0) {
                List<String> imagePaths = rsv.getImagePathsByReviewId(review.getRno());
                reviewDTO.setImagePaths(imagePaths);
            }
            reviewDTOList.add(reviewDTO);
        }
        return reviewDTOList;
    }

    @GetMapping("/getCount/{contentId}")
    @ResponseBody
    public int getCount(@PathVariable("contentId")String contentId){
        return rsv.getCount(contentId);
    }

    @GetMapping("/getPlaceScore/{contentId}")
    @ResponseBody
    public int getPlaceScore(@PathVariable("contentId")String contentId){
        Integer score = rsv.getPlaceScore(contentId);
        return score != null ? score : 0;
    }

    @GetMapping("/checkReviewLike/{rno}/{unoNum}")
    @ResponseBody
    public boolean checkReviewLike(@PathVariable("rno")String rno,@PathVariable("unoNum")String uno){
        int isLiked = rsv.checkReviewLike(rno,uno);
        return isLiked > 0;
    }
    @PostMapping("/clickLike/{rno}/{unoNum}")
    @ResponseBody
    @Transactional
    public String clickLike(@PathVariable("rno")String rno,@PathVariable("unoNum")String uno){
        int clickLike = rsv.clickLike(rno, uno);
        if(clickLike > 0){
            rsv.plusCount(rno);
            return "clickSuccess";
        }
        return "fail";
    }
    @DeleteMapping("/unClickLike/{rno}/{unoNum}")
    @ResponseBody
    @Transactional
    public String unClickLike(@PathVariable("rno")String rno,@PathVariable("unoNum")String uno){
        int clickLike = rsv.unClickLike(rno, uno);
        if(clickLike > 0){
            rsv.minusCount(rno);
            return "unClickSuccess";
        }
        return "fail";
    }
    @GetMapping("/getLikeCount/{rno}")
    @ResponseBody
    public int getLikeCount(@PathVariable("rno")String rno){
        return rsv.getLikeCount(rno);
    }

    @PostMapping("/review/report")
    @ResponseBody
    @Transactional
    public ResponseEntity<?> reportReview(@RequestBody ReviewReportVO reviewReportVO) {
        int isIn = rsv.saveReport(reviewReportVO);
        if(isIn > 0){
            rsv.updateReportCount(reviewReportVO.getRno());
            return ResponseEntity.ok("신고완료");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("에러");
    }
    @GetMapping("/getReportList/{rno}/{unoNum}")
    @ResponseBody
    public String getReportList(@PathVariable("rno")long rno, @PathVariable("unoNum")long uno){
        int isChecked = rsv.checkReport(rno, uno);
        if(isChecked > 0){
            return "true";
        }
        return "false";
    }
    @GetMapping("/getReportCount/{rno}")
    @ResponseBody
    public String getReportCount(@PathVariable("rno")long rno){
        int count = rsv.getReportCount(rno);
        if(count >= 3){
            return "many";
        }
        return "ok";
    }
}
