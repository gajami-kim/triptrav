package com.www.triptrav.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.www.triptrav.domain.TourDataVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class TourDataService {

    private final ResourceLoader resourceLoader;
    private List<TourDataVO> tourDataList;

    public TourDataService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
        loadTourData();
    }

    private void loadTourData() {
        if (tourDataList == null) {
            tourDataList = new ArrayList<>();
            try {
                Resource resource = resourceLoader.getResource("classpath:static/dist/json/simplifiedTourData.json");
                ObjectMapper objectMapper = new ObjectMapper();

                JsonNode rootNode = objectMapper.readTree(resource.getInputStream());

                for (JsonNode item : rootNode) {
                    String contentTypeId = item.path("contenttypeid").asText();
                    TourDataVO data = new TourDataVO(
                            item.path("contentid").asLong(),
                            item.path("contenttypeid").asLong(),
                            item.path("title").asText()
                    );
                    tourDataList.add(data);
                }
            } catch (IOException e) {
                log.error("데이터 로딩 에러", e);
            }
        }
    }
    public List<TourDataVO> getTourDataList() {
        return tourDataList;
    }
}
