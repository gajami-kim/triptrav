package com.www.triptrav.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class JsonSimplifierService {

    public static void main(String[] args) {
        String inputFilePath = "src/main/resources/static/dist/json/tourData.json";
        String outputFilePath = "src/main/resources/static/dist/json/planData.json";
        simplifyJson(inputFilePath, outputFilePath);
    }

    public static void simplifyJson(String inputFilePath, String outputFilePath) {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayNode simplifiedItems = objectMapper.createArrayNode();

        try {
            JsonNode rootNode = objectMapper.readTree(new File(inputFilePath));
            for (JsonNode responseNode : rootNode) {
                JsonNode itemsNode = responseNode.path("response").path("body").path("items").path("item");
                if (itemsNode.isArray()) {
                    for (JsonNode itemNode : itemsNode) {
                        String contenttypeid = itemNode.path("contenttypeid").asText();
                        if ("12".equals(contenttypeid)||"14".equals(contenttypeid)||"15".equals(contenttypeid)|| "39".equals(contenttypeid)) {
                            ObjectNode simplifiedItem = objectMapper.createObjectNode();
                            simplifiedItem.put("contentid", itemNode.path("contentid").asText());
                            simplifiedItem.put("contenttypeid", contenttypeid);
                            simplifiedItem.put("firstimage", itemNode.path("firstimage").asText());
                            simplifiedItem.put("cat1", itemNode.path("cat1").asText());
                            simplifiedItem.put("cat2", itemNode.path("cat2").asText());
                            simplifiedItem.put("cat3", itemNode.path("cat3").asText());
                            simplifiedItem.put("areacode", itemNode.path("areacode").asText());
                            simplifiedItem.put("addr1", itemNode.path("addr1").asText());
                            simplifiedItem.put("addr2", itemNode.path("addr2").asText());
                            simplifiedItem.put("title", itemNode.path("title").asText());
                            simplifiedItems.add(simplifiedItem);
                        }
                    }
                }
            }
            try (FileWriter fileWriter = new FileWriter(outputFilePath)) {
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(fileWriter, simplifiedItems);
            }
            System.out.println("총 데이터 개수: " + simplifiedItems.size());
            System.out.println("JSON 파일이 간소화되어 저장되었습니다: " + outputFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
