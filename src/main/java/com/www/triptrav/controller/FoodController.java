package com.www.triptrav.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/food/*")
@Slf4j
@RequiredArgsConstructor
public class FoodController{

    @GetMapping("{contentId}")
    public String foodDetail(@PathVariable String contentId) {
        return "/food/foodDetail";
    }


}
