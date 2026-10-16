# 🤖 Phase 1: AI Companion MVP — Rules & Coding Guidelines

Tài liệu này định nghĩa toàn bộ quy tắc cốt lõi (Rules), tiêu chuẩn kỹ thuật (Standards) và quy trình thực thi bắt buộc áp dụng khi triển khai các module trong **Phase 1: AI Companion MVP** của dự án ImEnglish (dựa theo [progress/upcoming/01_phase_1_ai_companion.md](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming/01_phase_1_ai_companion.md)).

---

## 🏛️ 1. Nguyên Tắc Kiến Trúc Cốt Lõi (Architecture & Philosophy)

### 1.1. Dual-Database Pattern Cho AI
- **PostgreSQL**: Lưu trữ metadata quan hệ có cấu trúc:
  - Bảng `ai_sessions` (id UUID, `user_id`, `conversation_id` chuỗi Mongo ObjectId, `scenario_id`, `mode`, `status`, `started_at`, `ended_at`, `duration_seconds`, `message_count`, `report_generated`, `report_id`).
- **MongoDB**: Lưu trữ dữ liệu phi cấu trúc, dữ liệu hội thoại biến đổi nhanh và trí nhớ dài hạn:
  - Collection `ai_scenarios`: Danh mục kịch bản roleplay thực tế.
  - Collection `conversations`: Nhật ký chi tiết các lượt nói (turns/messages) giữa User và AI.
  - Collection `feedback_reports`: Báo cáo chấm điểm phát âm, ngữ pháp, CEFR và gợi ý tự nhiên.
  - Collection `long_term_memories`: Trí nhớ dài hạn của AI về sở thích, lỗi ngữ pháp lặp lại của học viên.

### 1.2. Nguyên Tắc Sư Phạm Khi Luyện Nói Với AI (Pedagogical Principles)
1. **Không ngắt lời sửa lỗi ngữ pháp giữa cuộc hội thoại (No Mid-turn Interruption)**:
   - Khi học viên đang nói sai ngữ pháp hoặc dùng từ chưa chuẩn, AI Tutor **tuyệt đối không ngắt lời** để chỉnh lỗi. AI phải đóng đúng vai trò nhân vật (stay in character) để duy trì sự tự tin và phản xạ tự nhiên của học viên.
   - Các lỗi ngữ pháp sẽ được AI ngầm ghi nhận và tổng hợp vào **Báo Cáo Đánh Giá (Feedback Report)** sau khi kết thúc buổi nói.
2. **Thích ứng linh hoạt theo trình độ CEFR (Adaptive Complexity)**:
   - **A1–A2**: AI nói câu ngắn (dưới 15 từ), từ vựng cơ bản, tốc độ chậm rãi, câu hỏi gợi ý dạng đóng hoặc lựa chọn.
   - **B1–B2**: AI nói câu phức hợp tự nhiên, đặt câu hỏi mở khơi gợi ý kiến cá nhân.
   - **C1–C2**: AI sử dụng thành ngữ (idioms), phrasal verbs nâng cao, thảo luận các vấn đề trừu tượng.

---

## ☕ 2. Backend Coding Standards (`imenglish-backend`)

### 2.1. Cấu Trúc Gói Module AI
Tất cả code backend thuộc Phase 1 phải nằm trong gói `com.imenglish.ai`:
```
com.imenglish.ai/
├── client/              # GeminiApiClient, GeminiPromptTemplates
├── controller/          # AiScenarioController, AiSessionController
├── document/            # Mongo Documents (ScenarioDocument, ConversationDocument, FeedbackReportDocument, MemoryDocument)
├── dto/
│   ├── request/         # CreateSessionRequest, SendMessageRequest, AssistRequest
│   └── response/        # ScenarioResponse, SessionResponse, AssistResponse, FeedbackReportResponse
├── mapper/              # AiMapper (MapStruct)
├── repository/          # ScenarioRepository, ConversationRepository, ReportRepository, MemoryRepository
└── service/             # AiScenarioService, AiSessionService, GeminiChatService, FeedbackReportService
```

### 2.2. Tích Hợp Google Gemini API
- **Model chính**: `gemini-1.5-flash` (cho tốc độ phản hồi cực nhanh < 1.5s trong hội thoại thời gian thực) và `gemini-1.5-pro` (cho tác vụ phân tích chuyên sâu báo cáo Feedback Report).
- **Quản lý API Key**: Đọc từ biến môi trường `GEMINI_API_KEY`. Tuyệt đối không hardcode trong mã nguồn.
- **Xử lý Bất Đồng Bộ (Async & Non-blocking)**:
  - Tác vụ sinh Feedback Report và trích xuất Long-term Memory phải chạy dưới `@Async("taskExecutor")` hoặc `CompletableFuture`, không làm block HTTP response khi học viên nhấn "Kết thúc phiên".
- **Cơ chế Fallback & Timeout**:
  - Đặt timeout tối đa cho mỗi lượt gọi Gemini API là 10 giây.
  - Nếu Gemini API bị nghẽn mạng hoặc vượt rate limit, hệ thống phải trả về câu thoại fallback tự nhiên (*"I'm listening, could you please say that one more time?"*), tuyệt đối không văng lỗi 500 sập phiên luyện tập.

### 2.3. Thiết Kế REST API Chuẩn Hóa
- `GET /api/v1/ai/scenarios`: Lấy danh sách kịch bản (hỗ trợ lọc `topic`, `level`, `keyword`, phân trang `page`, `size`).
- `GET /api/v1/ai/scenarios/{id}`: Xem chi tiết kịch bản và các câu mở đầu gợi ý.
- `POST /api/v1/ai/sessions`: Khởi tạo phiên luyện nói theo kịch bản được chọn.
- `POST /api/v1/ai/sessions/{id}/message`: Gửi lượt nói của học viên và nhận phản hồi tức thì từ AI.
- `POST /api/v1/ai/sessions/{id}/assist`: Trợ giúp gợi ý 3 phương án trả lời tự nhiên khi học viên bí từ.
- `POST /api/v1/ai/sessions/{id}/end`: Kết thúc phiên, tính thời lượng, kích hoạt tiến trình tạo báo cáo.
- `GET /api/v1/ai/sessions/{id}/report`: Lấy chi tiết báo cáo đánh giá buổi học.

---

## 🎨 3. Frontend Standards (`imenglish-frontend`)

### 3.1. Tuân Thủ Nghiêm Ngặt Quy Chuẩn Chống "AI Slop"
- Tiếp tục tuân thủ theo [frontend-design](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/.agents/skills/frontend-design/SKILL.md) và [06_UI_UX_Design_Audit_And_Roadmap.md](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/docs/06_UI_UX_Design_Audit_And_Roadmap.md):
  - Không để lộ UUID, Role, mã lỗi lập trình ra ngoài màn hình.
  - Sử dụng bảng màu Deep Slate `#0B1120`, xanh Sapphire `#0284C7`, xanh phát âm `#10B981` và font `Plus Jakarta Sans`.

### 3.2. Tiêu Chuẩn Trải Nghiệm Luyện Nói (Voice & Audio UX)
1. **Web Speech API**:
   - `webkitSpeechRecognition` / `SpeechRecognition`: Nhận diện giọng nói tiếng Anh (`lang: 'en-US'`).
   - `speechSynthesis`: Phát âm giọng đọc AI tự nhiên. Hỗ trợ thanh điều chỉnh tốc độ nói (0.8x cho A1/A2; 1.0x chuẩn; 1.2x nâng cao).
2. **Chế độ Dự Phòng Nhập Văn Bản (Keyboard Fallback)**:
   - Nếu trình duyệt không hỗ trợ Web Speech API hoặc học viên chưa cấp quyền Micro, luôn có sẵn ô gõ bàn phím để học viên vẫn tương tác được bình thường.
3. **Hiệu Ứng Sóng Âm Thanh Động (Waveform HUD)**:
   - Hiển thị sóng âm chuyển động khi AI đang nói hoặc khi học viên đang phát âm.
4. **Trợ Giúp Nhanh (Real-time Assist Popover)**:
   - Hiển thị nút *"Gợi ý câu trả lời"* (phím tắt `Space` hoặc `Ctrl + Space`). Khi bấm sẽ mở bảng 3 câu trả lời tự nhiên theo 3 cấp độ (Simple, Confident, Native-like).

---

## 🔄 4. Quy Trình Tuần Tự Thực Thi & Báo Cáo (Phase 1 Protocol)

1. **Tuần tự từng công đoạn**: Phải làm xong, compile sạch, chạy test và xác thực từng công đoạn trước khi qua công đoạn mới.
2. **Báo cáo giải thích kỹ thuật**: Sau mỗi công đoạn, Agent phải:
   - Liệt kê các file đã tạo hoặc cập nhật.
   - Giải thích ý nghĩa của các Class, Annotation và Document Schema.
   - Cung cấp kết quả kiểm thử (Maven build, API test log, curl/Postman).
   - Đề xuất việc tiếp theo và chờ User xác nhận.
3. **Quản lý Git sạch sẽ**: Mọi thay đổi hoàn tất đều phải commit có quy chuẩn (`feat:`, `fix:`, `docs:`) và đẩy lên remote branch.
