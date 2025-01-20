package com.www.triptrav.controller;

import com.www.triptrav.service.CategoryService;
import com.www.triptrav.service.TasteService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
@RequestMapping("/taste/*")
@RequiredArgsConstructor
public class TasteController {

    private final CategoryService csv;
    private final TasteService tsv;

    @GetMapping("/")
    public String tasteIndex(HttpSession session, Model model) {
        List<Integer> cnoList = (List<Integer>) session.getAttribute("cnoList");
        model.addAttribute("cnoList", cnoList);
        return "taste/taste";
    }

    @PostMapping("/addTaste")
    @ResponseBody
    @Transactional
    public String getCategoryCodes(@RequestBody Map<String, Object> requestData, HttpSession session) {
        List<String> categoryNames = (List<String>) requestData.get("categoryNames");
        String uno = (String) requestData.get("uno");
        List<Integer> cnoList = csv.getCategoryCodes(categoryNames);
        session.setAttribute("cnoList", cnoList);
        int isData = tsv.checkData(uno);
        if (isData > 0) {
            int isUpdate = tsv.updateData(cnoList, uno);
            if (isUpdate > 0) {
                return "updateSuccess";
            }
        } else {
            int isIn = tsv.insertData(cnoList, uno);
            if (isIn > 0) {
                return "insertSuccess";
            }
        }
        return "fail";
    }

    @GetMapping("/getTrend/{age}/{gender}")
    @ResponseBody
    public List<Map<String, Object>> getTrend(@PathVariable("age")int age, @PathVariable("gender")int gender) {
        return tsv.getTrend(age, gender);
    }
}
