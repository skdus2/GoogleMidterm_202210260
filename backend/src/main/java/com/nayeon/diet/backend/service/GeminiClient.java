package com.nayeon.diet.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiClient {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model.name}")
    private String modelName;

    @Value("${gemini.api.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, String>> getRecommendations(String prompt) {
        // ✅ 1. 요청 URL
        String url = baseUrl + modelName + ":generateContent?key=" + apiKey;

        // ✅ 2. 요청 본문 생성
        Map<String, Object> content = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        // ✅ 3. HTTP 요청 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(content, headers);

        // ✅ 4. Gemini API 호출
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        // ✅ 5. 응답 텍스트 추출
        String text = extractText(response.getBody());

        // ✅ 6. 결과 파싱 ("음식명 - 이유")
        List<Map<String, String>> resultList = new ArrayList<>();
        if (text != null) {
            String[] lines = text.split("\n");
            for (String line : lines) {
                if (line.contains("-")) {
                    String[] parts = line.split("-", 2);
                    Map<String, String> map = new HashMap<>();
                    map.put("menu", parts[0].replaceAll("[0-9. ]", "").trim());
                    map.put("reason", parts[1].trim());
                    resultList.add(map);
                }
            }
        }

        return resultList;
    }

    // ✅ Gemini API 응답 텍스트만 추출하는 메서드
    private String extractText(Map responseBody) {
        try {
            List candidates = (List) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) return null;

            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            if (parts == null || parts.isEmpty()) return null;

            return (String) ((Map) parts.get(0)).get("text");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}