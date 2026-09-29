package com.jobCrawler.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobCrawler.backend.models.RawJob;
import com.jobCrawler.backend.repositories.RawJobRepository;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AiParsingService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private RawJobRepository rawJobRepository;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Chạy nền (không chặn request cào bài về từ bot): parse bằng Gemini rồi
     * cập nhật lại bản ghi RawJob tương ứng. Cần @EnableAsync ở lớp
     * BackendApplication để annotation @Async có hiệu lực.
     */
    @Async
    public void parseAndPersist(Long rawJobId, String rawContent) {
        String parsedJsonString = parseRawContentToFormattedJson(rawContent);

        rawJobRepository.findById(rawJobId).ifPresent(rawJob -> {
            rawJob.setParsedDataJson(parsedJsonString);
            rawJob.setAiProcessed(true);
            rawJobRepository.save(rawJob);
        });
    }

    /**
     * Trả về trực tiếp chuỗi JSON đã bóc tách để ghi thẳng vào CSDL.
     * Luôn trả về một chuỗi JSON hợp lệ (không bao giờ ném exception ra ngoài) -
     * nếu có bất kỳ lỗi gì (Gemini lỗi, hết quota, response rỗng, key sai...)
     * sẽ rơi về createFallbackJson thay vì làm crash luồng gọi.
     */
    public String parseRawContentToFormattedJson(String rawContent) {
        if (rawContent == null || rawContent.trim().isEmpty()) {
            return createFallbackJson(rawContent);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey.trim();

            String prompt = """
                Bạn là bộ trích xuất dữ liệu tuyển dụng chuyên nghiệp. Hãy phân tích đoạn văn bản thô sau và trả về DUY NHẤT một đối tượng JSON thuần túy (không dùng ```json) chứa đầy đủ các trường sau:
                {
                  "jobTitle": "Tên vị trí công việc chính (ví dụ: STRATEGY PLANNING & BUSINESS DEVELOPMENT hoặc Tester)",
                  "companyName": "Tên công ty tuyển dụng nếu có (ví dụ: KJ GLOBEXUS)",
                  "category": "Ngành nghề phù hợp (ví dụ: FinTech, IT, Marketing, Sales)",
                  "hrEmail": "Địa chỉ email liên hệ/ứng tuyển (ví dụ: hr@kj-globexus.com)",
                  "contactPhone": "Số điện thoại hoặc Zalo liên hệ (ví dụ: 0236 382 2239)",
                  "location": "Địa điểm làm việc cụ thể (ví dụ: 52 Nguyễn Văn Linh, Hải Châu, Đà Nẵng)",
                  "jobType": "Full-time hoặc Part-time",
                  "requirements": "Các yêu cầu đối với ứng viên",
                  "benefits": "Quyền lợi và chế độ đãi ngộ",
                  "description": "Mô tả vắn tắt công việc hoặc cơ hội gia nhập"
                }

                LƯU Ý: Nếu không tìm thấy thông tin của ô nào, hãy trả về giá trị rỗng "" thay vì null.

                Văn bản tuyển dụng thô:
                """ + rawContent;

            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> partsObj = Map.of("parts", List.of(textPart));
            Map<String, Object> generationConfig = Map.of("responseMimeType", "application/json");

            Map<String, Object> contentsObj = Map.of(
                    "contents", List.of(partsObj),
                    "generationConfig", generationConfig
            );

            String jsonPayload = mapper.writeValueAsString(contentsObj);

            RequestBody body = RequestBody.create(jsonPayload, MediaType.parse("application/json; charset=utf-8"));
            Request request = new Request.Builder().url(url).post(body).build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    System.err.println("[GEMINI ERROR CODE]: " + response.code() + " - " + response.message());
                    return createFallbackJson(rawContent);
                }

                String responseString = response.body().string();
                JsonNode rootNode = mapper.readTree(responseString);

                // Kiểm tra kỹ từng bước thay vì .get(0) trực tiếp, vì Gemini có thể
                // trả về "candidates" rỗng (ví dụ bị chặn bởi safety filter, hết quota...)
                JsonNode candidates = rootNode.path("candidates");
                if (!candidates.isArray() || candidates.isEmpty()) {
                    System.err.println("[GEMINI WARNING] Response không có candidates: " + responseString);
                    return createFallbackJson(rawContent);
                }

                JsonNode partsNode = candidates.get(0).path("content").path("parts");
                if (!partsNode.isArray() || partsNode.isEmpty()) {
                    System.err.println("[GEMINI WARNING] Response không có parts: " + responseString);
                    return createFallbackJson(rawContent);
                }

                String aiJsonString = partsNode.get(0).path("text").asText("").trim();
                if (aiJsonString.isEmpty()) {
                    System.err.println("[GEMINI WARNING] Text bóc tách rỗng.");
                    return createFallbackJson(rawContent);
                }

                // Xác nhận chuỗi trả về thực sự là JSON hợp lệ trước khi lưu vào DB,
                // tránh lưu văn bản lỗi (ví dụ Gemini lỡ trả kèm text thừa) khiến
                // Frontend JSON.parse() thất bại khi hiển thị form.
                try {
                    mapper.readTree(aiJsonString);
                } catch (Exception jsonEx) {
                    System.err.println("[GEMINI WARNING] Text trả về không phải JSON hợp lệ: " + aiJsonString);
                    return createFallbackJson(rawContent);
                }

                System.out.println("========== [KẾT QUẢ AI BÓC TÁCH THÀNH CÔNG] ==========");
                System.out.println(aiJsonString);
                System.out.println("=======================================================");

                return aiJsonString;
            }
        } catch (Exception e) {
            System.err.println("[AI PARSE EXCEPTION]: " + e.getMessage());
            e.printStackTrace();
            return createFallbackJson(rawContent);
        }
    }

    private String createFallbackJson(String rawContent) {
        String title = rawContent != null && rawContent.length() > 60 ? rawContent.substring(0, 60) + "..." : rawContent;
        String safeTitle = title != null ? title.replace("\"", "'").replace("\n", " ") : "Bài đăng tuyển dụng";
        String safeDesc = rawContent != null ? rawContent.replace("\"", "'").replace("\n", " ") : "";

        return String.format("{\"jobTitle\":\"%s\",\"description\":\"%s\"}", safeTitle, safeDesc);
    }
}