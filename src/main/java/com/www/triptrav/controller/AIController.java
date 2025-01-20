package com.www.triptrav.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.www.triptrav.service.AIService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/ai/*")
@Slf4j
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeTouristAttractions(@RequestBody Map<String, List<String>> requestBody) {
        List<String> placeNames = requestBody.get("placeNames");
        List<String> placeTag = requestBody.get("placeTag");
        String analysisResult = aiService.analyzeTouristAttractions(placeNames,placeTag);
        Map<String, Object> recommendations = parseAnalysisResult(analysisResult);
        return ResponseEntity.ok(recommendations);
    }

    private Map<String, Object> parseAnalysisResult(String analysisResult) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(analysisResult, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "파싱에러");
        }
    }
    @PostMapping("/analyzeReviews")
    public ResponseEntity<Map<String, Object>> analyzeReviews(@RequestBody Map<String, List<String>> requestBody) {
        List<String> reviews = requestBody.get("reviews");
        String analysisResult = aiService.analyzeReviews(reviews);
        Map<String, Object> analysisResponse = parseAnalysisResult(analysisResult);
        return ResponseEntity.ok(analysisResponse);
    }
}
