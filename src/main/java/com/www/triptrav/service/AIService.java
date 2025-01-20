package com.www.triptrav.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AIService {
    private final String apiUrl = "https://api.openai.com/v1/chat/completions";
    @Value("${gpt.secret.key}")
    private String apiKey;

    public String analyzeTouristAttractions(List<String> attractionNames, List<String> attractionTags) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");
        Map<String, String> messageContent = new HashMap<>();
        messageContent.put("role", "user");
        messageContent.put("content", generatePrompt(attractionNames,attractionTags));
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(messageContent);
        requestBody.put("messages", messages);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequestBody;
        try {
            jsonRequestBody = objectMapper.writeValueAsString(requestBody);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "Error creating request body.";
        }
        HttpEntity<String> entity = new HttpEntity<>(jsonRequestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);
        return parseResponse(response.getBody());
    }


    private String generatePrompt(List<String> attractionNames, List<String> attractionTags) {
        return "다음 관광지들의 태그를 분석해서 새로운 관광지 10개를 추천 해줘 추천이유는 공통적으로 하나로 종합해줘"
                + String.join(", ", attractionTags)
                + "추천 관광지는 내가 보낸 관광지이름들과는 중복되지 않게 추천해줘"
                + String.join(", ", attractionNames)
                + "분석 결과를 JSON 형식으로 반환해 줘 예시 : [{\"이름\": \"관광지1\", \"추천이유\": \"이유\"}, ...]";
    }

    private String parseResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);

            if (rootNode.isArray()) {
                List<Map<String, Object>> responseList = objectMapper.convertValue(rootNode, new TypeReference<List<Map<String, Object>>>(){});
                return objectMapper.writeValueAsString(responseList);
            } else if (rootNode.isObject()) {
                Map<String, Object> responseMap = objectMapper.convertValue(rootNode, new TypeReference<Map<String, Object>>(){});
                return objectMapper.writeValueAsString(responseMap);
            } else {
                return "Unexpected JSON format.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing response.";
        }
    }
    public String analyzeReviews(List<String> reviews) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");
        Map<String, String> messageContent = new HashMap<>();
        messageContent.put("role", "user");
        messageContent.put("content", generateReviewPrompt(reviews));
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(messageContent);
        requestBody.put("messages", messages);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequestBody;
        try {
            jsonRequestBody = objectMapper.writeValueAsString(requestBody);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "Error creating request body.";
        }
        HttpEntity<String> entity = new HttpEntity<>(jsonRequestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);
        return parseResponse(response.getBody());
    }

    private String generateReviewPrompt(List<String> reviews) {
        return "다음 리뷰리스트를 분석해서 분석결과를 요약해줘"
                + "내가 보낸 리뷰리스트를 다시 출력해줄 필요는 없어"
                + "긍정적, 부정적 리뷰를 모아서 보여줄 필요는 없어"
                + "분석결과는 3줄로 어느정도 길게 요약해줘"
                + String.join(", ", reviews)
                + "난 종합결과만 필요해 예시로 종합결과 : 내용 이런형태로";
    }
}
