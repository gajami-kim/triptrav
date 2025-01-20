package com.www.triptrav.controller;

import com.www.triptrav.domain.LikeVO;
import com.www.triptrav.domain.PathVO;
import com.www.triptrav.service.PathService;
import com.www.triptrav.service.TripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/trip")
@Slf4j
@RequiredArgsConstructor
public class TripController {

    private final PathService psv;
    private final TripService tsv;

    @GetMapping("/")
    public String goTrips(){
        return "trip/trips";
    }

    @ResponseBody
    @GetMapping("/courseCall")
    public List<PathVO> goCourseCall(){
        return psv.loadServeList();
    }

    @ResponseBody
    @GetMapping("/likeListCall")
    public List<String> getLikeList(@RequestParam long uno){
        log.info("uno111 >>>{}",uno);
        log.info("tsv>>  {}",tsv.getLikeList(uno));
        return tsv.getLikeList(uno);
    }

    @ResponseBody
    @DeleteMapping("/delLike")
    public String delLike(@RequestBody LikeVO like){
        int isOk =  tsv.delLike(like);
        if(isOk == 1){
            return "de";
        }
        return "nodelete";
    }

    @ResponseBody
    @PostMapping("/addLike")
    public String addLike(@RequestBody LikeVO like){
        int isOk =  tsv.addLike(like);
        if(isOk == 1){
            return "in";
        }
        return "noinsert";

    }


}
