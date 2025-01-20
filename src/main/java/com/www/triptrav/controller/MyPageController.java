package com.www.triptrav.controller;

import com.www.triptrav.domain.*;
import com.www.triptrav.service.MyPageService;
import com.www.triptrav.service.PathService;
import com.www.triptrav.service.TourDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;


@Controller
@RequiredArgsConstructor
@RequestMapping("/mypage")
@Slf4j
public class MyPageController {

    private final MyPageService msv;
    private final PasswordEncoder passwordEncoder;
    private final PathService psv;

    @GetMapping
    public String mypage(@RequestParam long uno) {
        return "/mypage/myPage";
    }

    @ResponseBody
    @GetMapping("/isSocial")
    public UserVO isSocial(@RequestParam long uno) {
        log.info("isSocialUser uno = {}", uno);
        UserVO uvo = msv.isSocial(uno);
        log.info("isSocialUser uvo = {}", uvo);
        return uvo;
    }

    @ResponseBody
    @GetMapping("/scheduleCall")
    public List<ScheduleDTO> scheduleCall(@RequestParam long uno) {
        List<ScheduleVO> scheList = msv.scheduleCall(uno);
        List<ScheduleDTO> scheduleDTOList = new ArrayList<>();
        for (ScheduleVO svo : scheList) {
            ScheduleDTO scheDTO = new ScheduleDTO();
            ScheduleDetailVO sdvo = msv.getScheduleDetail(svo.getSco());
            ScheduleRoleVO srvo = new ScheduleRoleVO(
                    svo.getSco(),
                    uno);
            int roleNum = msv.getRole(srvo);
            scheDTO.setSco(svo.getSco());
            scheDTO.setScheName(svo.getScheName());
            scheDTO.setScheStart(svo.getScheStart());
            scheDTO.setScheEnd(svo.getScheEnd());
            scheDTO.setScheTitle(sdvo.getScheTitle());
            scheDTO.setScheImg(svo.getScheImg());
            scheDTO.setScheRole(roleNum);
            scheduleDTOList.add(scheDTO);
        }
        return scheduleDTOList;
    }

    @ResponseBody
    @GetMapping("/getReview")
    public List<ReviewDTO> getReviewList(@RequestParam long uno) {
        List<ReviewVO> reList = msv.getReviewList(uno);
        List<ReviewDTO> reviewDTOList = new ArrayList<>();
        List<PathVO>mainImg = psv.loadPathList();
        for (ReviewVO review : reList) {
            ReviewDTO reviewDTO = new ReviewDTO();
            for(PathVO pathVO : mainImg) {
                if(review.getReContentId() == pathVO.getContentId()){
                    if(pathVO.getFirstImage().isEmpty()){
                        // 또 다른 js에서 돌려서 가져오기
                    }else {
                        reviewDTO.setFirstImage(pathVO.getFirstImage());
                    }
                }
            }
            reviewDTO.setReview(review);
            List<ReviewImageVO> reImageList = msv.getReviewDTOList(review.getRno());
            List<String> imagePaths = new ArrayList<>();
            for (ReviewImageVO image : reImageList) {
                imagePaths.add(image.getImagePath());
            }
            reviewDTO.setImagePaths(imagePaths);
            reviewDTOList.add(reviewDTO);
        }
        return reviewDTOList;
    }


    @GetMapping("/reviewPopup")
    public String reviewPopup(@RequestParam long rno, Model model) {
        ReviewVO reList = msv.getPopReview(rno);
        ReviewDTO reviewDTOList = new ReviewDTO();
        reviewDTOList.setReview(reList); // 리뷰 정보 설정
        List<ReviewImageVO> reImageList = msv.getReviewDTOList(rno);
        List<String> imagePaths = new ArrayList<>();
        for (ReviewImageVO image : reImageList) {
            imagePaths.add(image.getImagePath());
        }
        reviewDTOList.setImagePaths(imagePaths);
        model.addAttribute("review", reviewDTOList);
        return "mypage/reviewPopup";
    }

    @ResponseBody
    @PostMapping("/updateUser")
    public int updateUser(@RequestParam("uno") Long uno,
                             @RequestParam("nickname") String nickname,
                             @RequestParam("pw") String pw,
                             @RequestParam("provider") String provider,
                             @RequestParam(value = "profile", required = false) MultipartFile profile)
                                throws IOException {
        UserVO userVO = new UserVO();
        userVO.setUno(uno);
        if(provider.equals("null")) {
            if(!pw.isEmpty()) {
            userVO.setPw(passwordEncoder.encode(pw));
            }
            userVO.setNickname(nickname);
            if (profile != null && !profile.isEmpty()) {
                String uploadFolder = "C:/image";
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
                String dateFolder = sdf.format(new Date());
                File uploadPath = new File(uploadFolder, dateFolder);
                if (!uploadPath.exists()) {
                    uploadPath.mkdirs();
                }
                String uuid = UUID.randomUUID().toString();
                String originalFilename = profile.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String savedFilename = uuid + extension;
                Path savePath = Paths.get(uploadPath.getAbsolutePath(), savedFilename);
                profile.transferTo(savePath.toFile());
                String path = savePath.toString().replace("\\","/");
                userVO.setProfile(path.replace("C:/image/", ""));
            }
           return msv.updateCommonUser(userVO);
        }else{
            userVO.setUno(uno);
            userVO.setNickname(nickname);
          return msv.updateSocialUserName(userVO);
        }

    }

    @ResponseBody
    @DeleteMapping("schedule")
    public int scheduleDelete(@RequestParam long sco) {
        int isDel = msv.scheduleDelete(sco);
        return isDel;
    }

    @ResponseBody
    @GetMapping("likeCall")
    public List<LikeDTO> likeCall(@RequestParam long uno) {
        LikeVO lvo = new LikeVO();
        lvo.setUno(uno);
        lvo.setTypeId(0); //장소 불러오기
        List<LikeVO> like = msv.getLikePlace(lvo);
        List<LikeDTO> likeDTOList = new ArrayList<>();
        List<PathVO> pathVOList = psv.loadPathList();
        for(LikeVO likeVO : like) {
            LikeDTO likeDTO = new LikeDTO();
            likeDTO.setLike(likeVO);
            for(PathVO pathVO : pathVOList) {
                if(likeVO.getLikeCode() == pathVO.getContentId()){
                    likeDTO.setFirstImage(pathVO.getFirstImage());
                    likeDTO.setContentTypeId(pathVO.getContentTypeId());
                }
            }
            likeDTOList.add(likeDTO);
        }
        return likeDTOList;
    }

    @ResponseBody
    @GetMapping("tripCall")
    public List<LikeDTO> tripCall(@RequestParam long uno) {
        LikeVO lvo = new LikeVO();
        lvo.setUno(uno);
        lvo.setTypeId(1); // 코스 불러오기
        log.info("lvo >> {}",lvo);
        List<LikeVO> tripList = msv.getLikePlace(lvo);
        List<LikeDTO> likeDTOList = new ArrayList<>();
        List<PathVO> pathVOList = psv.loadServeList();
        for(LikeVO likeVO : tripList) {
            LikeDTO likeDTO = new LikeDTO();
            likeDTO.setLike(likeVO);
            for(PathVO pathVO : pathVOList) {
                if(likeVO.getLikeCode() == pathVO.getContentId()){
                    likeDTO.setFirstImage(pathVO.getFirstImage());
                    likeDTO.setContentTypeId(pathVO.getContentTypeId());
                    likeDTO.setTitle(pathVO.getTitle());
                }
            }
            likeDTOList.add(likeDTO);
        }
        log.info("DTOList >> {}", likeDTOList);
        return likeDTOList;
    }


    @ResponseBody
    @DeleteMapping("likeDel")
    public int likeDel(@RequestBody LikeVO likeVO) {
        log.info("lvo >>> {}",likeVO);
        return msv.delLike(likeVO);
    }


    @GetMapping("/tripList")
    public void tripList() {
    }

    @GetMapping("/tripReview")
    public void tripReview() {
    }

    @GetMapping("/wishPlace")
    public void wishPlace() {
    }

    @GetMapping("/wishTrip")
    public void wishTrip() {
    }
}
