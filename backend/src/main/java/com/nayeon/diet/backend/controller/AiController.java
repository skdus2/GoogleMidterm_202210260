package com.nayeon.diet.backend.controller;

import com.nayeon.diet.backend.entity.*;
import com.nayeon.diet.backend.repository.*;
import com.nayeon.diet.backend.service.GeminiClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    @Autowired
    private GeminiClient geminiClient;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private MealRecordRepository mealRecordRepository;

    @Autowired
    private LocationRepository locationRepository;

    @PostMapping("/recommend")
    public List<Map<String, String>> recommendFood(@RequestBody Map<String, String> request) throws IOException {
        String userPrompt = request.get("prompt");
        String nickname = request.get("nickname");
        String mealTime = request.getOrDefault("mealTime", "식사시간 미지정");

        /* ✅ 1️⃣ 사용자 상태 조회 */
        String statusText = "상태 정보 없음";
        Optional<Status> userStatus = statusRepository.findByNickname(nickname);
        if (userStatus.isPresent()) {
            Status s = userStatus.get();
            statusText = String.format(
                    "현재 상태: %s, 목표: %s, 알러지: %s, 메모: %s",
                    s.getCondition(), s.getGoal(), s.getAllergy(), s.getNotes()
            );
        }

        /* ✅ 2️⃣ 최근 한 달간 식사 기록 조회 */
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(30);
        List<MealRecord> recentMeals = mealRecordRepository.findRecentMeals(startDate, endDate);

        String mealHistoryText = "최근 한 달간 식사 기록 없음";
        if (!recentMeals.isEmpty()) {
            mealHistoryText = recentMeals.stream()
                    .map(r -> String.format("%s - %s", r.getDate().toLocalDate(), r.getMenu().getName()))
                    .collect(Collectors.joining("\n"));
        }

        String selectedLocationName = request.getOrDefault("location", "그 외");

        Location currentLocation = null;
        if (!selectedLocationName.equals("그 외")) {
            currentLocation = locationRepository.findByName(selectedLocationName).orElse(null);
        }

        String menuListText;
        if (currentLocation == null || currentLocation.getDescription() == null || currentLocation.getDescription().isBlank()) {
            menuListText = "현재 선택된 장소가 없으므로, 메뉴 제한 없이 자유롭게 추천해도 돼.";
        } else {
            // description을 쉼표 기준으로 줄바꿈 처리
            String formattedMenus = Arrays.stream(currentLocation.getDescription().split(","))
                    .map(String::trim)
                    .map(m -> "- " + m)
                    .collect(Collectors.joining("\n"));
            menuListText = String.format("%s\n%s", currentLocation.getName(), formattedMenus);
        }

        /* ✅ 4️⃣ 프롬프트 구성 */
        String today = LocalDate.now().toString();

        String finalPrompt = String.format("""
            너는 개인 맞춤형 식단 추천 전문가야.
            아래 사용자의 상태, 최근 한 달 식사 기록, 제공 가능한 메뉴를 참고하여,
            오늘(%s) %s에 먹으면 좋은 음식 3~5개를 추천해줘.
            단, 출력 형식은 다음 예시를 정확히 따라야 해:
            각 줄은 "음식명 - 추천 이유" 형식으로만 작성하고,
            불필요한 문구("**", "추천이유:", 별표, 설명 문단 등)는 절대 넣지 마.
            오직 아래 예시처럼만 말해.

            예시:
                1. 김치찌개 - 김치찌개를 추천하는 이유
                2. 샐러드 - 샐러드를 추천하는 이유
                3. 돈까스 - 돈까스를 추천하는 이유

            최근 식습관을 고려해 영양 밸런스를 유지하도록 조언해줘.

            사용자 상태:
            %s

            최근 한 달간 식사 기록:
            %s

            제공 가능한 메뉴 목록:
            %s

            사용자 요청:
            %s
        """, today, mealTime, statusText, mealHistoryText, menuListText, userPrompt);

        /* ✅ 5️⃣ Gemini AI 호출 */
        return geminiClient.getRecommendations(finalPrompt);
    }
}