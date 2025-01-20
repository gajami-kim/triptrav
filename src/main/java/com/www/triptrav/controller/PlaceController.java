package com.www.triptrav.controller;

import com.www.triptrav.domain.LikeVO;
import com.www.triptrav.domain.ReviewVO;
import com.www.triptrav.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/place/*")
@RequiredArgsConstructor
@Slf4j
public class PlaceController {

    private final LikeService lsv;

    @GetMapping("/{contentId}")
    public String placeIndex(@PathVariable String contentId) {
        return "place/placeDetail";
    }

    @PostMapping("/like")
    @ResponseBody
    public String addLike(@RequestBody LikeVO likeVO) {
        likeVO.setTypeId(0);
        int isIn = lsv.addLike(likeVO);
        if(isIn > 0){
            return "success";
        }
        return "fail";
    }
    @GetMapping("/like/{uno}/{likeCode}")
    @ResponseBody
    public String likeStatus(@PathVariable long uno, @PathVariable long likeCode) {
        int isLike = lsv.likeStatus(uno, likeCode);
        if(isLike > 0){
            return "on";
        }
        return "off";
    }
    @DeleteMapping("/like")
    @ResponseBody
    public String deleteLike(@RequestBody LikeVO likeVO) {
        int isIn = lsv.deleteLike(likeVO);
        if(isIn > 0){
            return "deleteSuccess";
        }
        return "deleteFail";
    }
}
