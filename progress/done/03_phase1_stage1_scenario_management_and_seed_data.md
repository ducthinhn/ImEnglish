# 📝 Báo Cáo Tiến Độ Dự Án — Giai Đoạn 1: Quản Lý Kịch Bản (Scenarios) & Seed Data

> **Ngày thực hiện**: 16/10/2026  
> **Trạng thái**: ✅ Hoàn thành 100% Công đoạn 1 (Phase 1 AI Companion)  
> **Git Commit**: `4f8a7c9` (Đã push lên remote branch `feature/phase0-foundation`)  
> **Người thực hiện**: Antigravity Pair Programming Agent

---

## 🎯 1. Tổng Quan Nội Dung Đã Thực Hiện Hôm Nay

Hôm nay dự án đã hoàn thành trọn vẹn 2 mảng công việc lớn:
1. **Hoàn thiện & Tinh chỉnh Toàn diện Phase 0 (Auth & UI/UX Audit)**:
   - Kiểm tra và xác nhận toàn bộ cụm Docker containers (`PostgreSQL`, `MongoDB`, `Redis`, `CoTurn`) hoạt động ổn định.
   - Refactor 4 màn hình chính dựa trên bản phân tích [06_UI_UX_Design_Audit_And_Roadmap.md](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/docs/06_UI_UX_Design_Audit_And_Roadmap.md).
   - Thêm ô **Xác nhận mật khẩu (Confirm Password)** kèm live matching indicator.
   - Thêm **Bộ kiểm tra mật khẩu thời gian thực (Real-time Password Checklist)**: độ dài $\ge 8$, chữ hoa, chữ thường, chữ số với animation chuyển trạng thái mượt mà.
   - Tối ưu CSS và font family, giải quyết triệt để lỗi build PostCSS.

2. **Thiết lập Nguyên Tắc & Hoàn Thành 100% Công Đoạn 1 (Phase 1: AI Companion MVP)**:
   - Thiết lập bộ quy tắc [PHASE_1_AI_COMPANION.md](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/.agents/rules/PHASE_1_AI_COMPANION.md) ràng buộc tiến độ từng bước, kiểm thử tự động, chuẩn hóa kiến trúc.
   - Thiết kế Document MongoDB `ScenarioDocument` trong collection `ai_scenarios`.
   - Xây dựng tầng Service, Repository, Mapper, DTO và REST Controller chuẩn RESTful.
   - Tự động nạp (Seed) **21 kịch bản đàm thoại thực tế** từ A1 đến C2.
   - Viết trọn bộ Integration Tests `AiScenarioControllerTest` (8/8 tests passed 100%).
   - Xây dựng Frontend API client, TypeScript definitions, và component modal chọn kịch bản chuyên nghiệp `ScenarioExplorerModal`.
   - Kết nối dữ liệu động từ MongoDB trực tiếp vào `HomePage.tsx`.

---

## 🏗️ 2. Chi Tiết Kỹ Thuật Các Thành Phần Đã Xây Dựng

### A. Backend (Java 21 + Spring Boot 3.3.4 + MongoDB)

1. **Document Data Model**: [ScenarioDocument.java](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-backend/src/main/java/com/imenglish/ai/document/ScenarioDocument.java)
   - Lưu trữ tại collection `ai_scenarios` trong MongoDB.
   - Các trường dữ liệu chính:
     - `code`: Mã định danh duy nhất (Unique Index), ví dụ `SCENARIO-A1-CAFE-01`.
     - `cefrLevel`: Cấp độ tiếng Anh (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`).
     - `aiRole` & `userRole`: Phân định vai trò nhập vai giữa gia sư AI và học viên.
     - `initialGreeting`: Câu chào khởi đầu tương tác giọng nói của AI.
     - `systemPromptInstruction`: Hướng dẫn chuyên sâu và giới hạn an toàn cho AI khi nhập vai.
     - `suggestedVocabulary`: Danh sách từ vựng trọng tâm cần vận dụng.
     - `conversationGoals`: 3 mục tiêu đàm thoại cần chinh phục trong bài học.
     - `estimatedDurationMinutes`, `difficulty`, `icon`, `orderIndex`, `isActive`.

2. **Data Repository**: [ScenarioRepository.java](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-backend/src/main/java/com/imenglish/ai/repository/ScenarioRepository.java)
   - Phân chia rõ ràng giữa MongoDB và JPA/PostgreSQL trong cấu hình [ImEnglishApplication.java](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-backend/src/main/java/com/imenglish/ImEnglishApplication.java) bằng cách chỉ định rõ `@EnableMongoRepositories(basePackages = "com.imenglish.ai.repository")` và `@EnableJpaRepositories(basePackages = "com.imenglish.repository")`.
   - Truy vấn động: phân trang, lọc theo topic, lọc theo level, tìm kiếm regex không phân biệt hoa thường.

3. **Data Initializer (Seed Data 21 Kịch Bản)**: [ScenarioDataInitializer.java](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-backend/src/main/java/com/imenglish/ai/config/ScenarioDataInitializer.java)
   - Tự động nạp khi hệ thống khởi chạy nếu collection chưa có dữ liệu.
   - Bao quát toàn diện các tình huống giao tiếp đời sống và công việc:
     - **A1**: Quán cà phê, Giới thiệu bản thân, Hỏi đường.
     - **A2**: Nhận phòng khách sạn, Mua sắm quần áo, Đặt lịch nha sĩ, Vé xem phim.
     - **B1**: Phỏng vấn xin việc (giới thiệu), Đổi vé chuyến bay trễ, Đặt món nhà hàng Ý, Lên kế hoạch du lịch.
     - **B2**: Khủng hoảng deadline dự án, Phàn nàn dịch vụ khách hàng, Bàn luận về AI, Phỏng vấn hành vi.
     - **C1**: Thương thảo hợp đồng & ngân sách, Xử lý khủng hoảng truyền thông PR, Tranh biện Remote work, Thuyết trình mở rộng thị trường.
     - **C2**: Đàm phán M&A sáp nhập xuyên quốc gia, Đối thoại ngoại giao song phương.

4. **REST API Controller**: [AiScenarioController.java](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-backend/src/main/java/com/imenglish/ai/controller/AiScenarioController.java)
   - `GET /api/v1/ai/scenarios`: Phân trang, tìm kiếm, lọc theo topic & level.
   - `GET /api/v1/ai/scenarios/{id}`: Xem chi tiết kịch bản theo ID hoặc Code.
   - `GET /api/v1/ai/scenarios/topics`: Lấy danh sách danh mục chủ đề có sẵn.
   - `GET /api/v1/ai/scenarios/featured`: Lấy danh sách kịch bản gợi ý theo trình độ học viên.

5. **Security Configuration**: [SecurityConfig.java](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-backend/src/main/java/com/imenglish/config/SecurityConfig.java)
   - Mở quyền truy cập `permitAll()` cho các API đọc kịch bản (`GET /api/v1/ai/scenarios/**`).

---

### B. Frontend (React 19 + TypeScript + Vite + Tailwind CSS)

1. **TypeScript Definitions & API Client**:
   - [src/types/scenario.ts](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-frontend/src/types/scenario.ts): Định nghĩa `Scenario`, `ScenarioFilterParams`, `PageResponse`.
   - [src/api/scenarioApi.ts](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-frontend/src/api/scenarioApi.ts): Tích hợp qua Axios với cấu hình token tự động.

2. **Scenario Explorer Modal**: [ScenarioExplorerModal.tsx](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-frontend/src/features/scenarios/components/ScenarioExplorerModal.tsx)
   - Thanh tìm kiếm từ khóa tức thì (instant search).
   - Bộ chọn cấp độ CEFR A1 -> C2 dạng tabs trực quan.
   - Bộ lọc dạng pill tags cho các chủ đề: *Casual, Travel, Career, Business, Technology, Diplomacy...*
   - Sub-modal preview chi tiết: Hiển thị mục tiêu bài nói (Goals), từ vựng gợi ý (Vocabulary badges), thông tin vai trò học viên và gia sư AI Anna.

3. **Tích Hợp HomePage Learner Dashboard**: [HomePage.tsx](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/imenglish-frontend/src/features/home/HomePage.tsx)
   - Tải danh sách kịch bản nổi bật trực tiếp từ backend MongoDB dựa theo `user.englishLevel`.
   - Nút **"Browse All 20+ Scenarios"** kết nối trực tiếp mở `ScenarioExplorerModal`.

---

## 🧪 3. Kết Quả Kiểm Thử (Testing & Quality Assurance)

| Hạng Mục Kiểm Thử | Công Cụ | Kết Quả | Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Backend Integration Tests** | Spring Boot Test / MockMvc / JUnit 5 | **100% PASSED** | 8/8 tests thành công trong `AiScenarioControllerTest` (phân trang, lọc, search, 404 handler) |
| **Frontend Production Build** | TypeScript Compiler (`tsc -b`) + Vite 8.3 | **0 ERRORS** | 2011 modules transformed, tạo bundle thành công trong 6.8s |
| **Docker Multi-Containers** | Docker Engine | **RUNNING** | PostgreSQL (5432), MongoDB (27017), Redis (6380), CoTurn (3478) hoạt động thông suốt |

---

## 📂 4. Cấu Trúc File Mới & Thay Đổi

```
ImEnglish/
├── .agents/rules/
│   └── PHASE_1_AI_COMPANION.md                      # [Mới] Quy tắc và nguyên tắc thực hiện Phase 1
├── imenglish-backend/
│   ├── src/main/java/com/imenglish/
│   │   ├── ImEnglishApplication.java                # Cấu hình tách biệt JPA & Mongo Repositories
│   │   ├── config/SecurityConfig.java               # Mở quyền public GET /api/v1/ai/scenarios/**
│   │   ├── dto/response/ApiResponse.java            # Bổ sung alias helper success()
│   │   ├── dto/response/PageResponse.java           # [Mới] DTO phân trang chuẩn
│   │   └── ai/
│   │       ├── document/ScenarioDocument.java       # [Mới] MongoDB Document cho Scenario
│   │       ├── repository/ScenarioRepository.java   # [Mới] Spring Data Mongo Repository
│   │       ├── dto/response/ScenarioResponse.java   # [Mới] Scenario DTO
│   │       ├── mapper/ScenarioMapper.java           # [Mới] MapStruct Mapper
│   │       ├── service/AiScenarioService.java       # [Mới] Interface nghiệp vụ
│   │       ├── service/impl/AiScenarioServiceImpl.java # [Mới] Triển khai nghiệp vụ
│   │       ├── controller/AiScenarioController.java # [Mới] REST Controller
│   │       └── config/ScenarioDataInitializer.java  # [Mới] Seed 21 kịch bản mẫu
│   └── src/test/java/com/imenglish/controller/ai/
│       └── AiScenarioControllerTest.java            # [Mới] 8 Integration Tests
├── imenglish-frontend/
│   └── src/
│       ├── types/scenario.ts                        # [Mới] Type definitions
│       ├── api/scenarioApi.ts                       # [Mới] Axios API client
│       ├── features/scenarios/components/
│       │   └── ScenarioExplorerModal.tsx            # [Mới] Modal khám phá & lọc kịch bản
│       └── features/home/HomePage.tsx               # Kết nối dữ liệu kịch bản thực tế
└── progress/
    ├── upcoming/01_phase_1_ai_companion.md          # Cập nhật checklist hoàn thành Công đoạn 1
    └── done/03_phase1_stage1_scenario_management_and_seed_data.md # [File này] Báo cáo chi tiết
```

---

## ⏭️ 5. Kế Hoạch Tiếp Theo (Công Đoạn 2)

Tại phiên làm việc tiếp theo, chúng ta sẽ bắt đầu thực hiện **Công đoạn 2: Quản Lý Phiên Luyện Tập Với AI (AI Sessions) & Tích Hợp Google Gemini API**:
1. Thiết kế tài liệu MongoDB `AiSessionDocument` và `AiConversationLogDocument` lưu trữ lịch sử tin nhắn.
2. API `POST /api/v1/ai/sessions` khởi tạo phiên luyện thoại theo kịch bản được chọn.
3. Cấu hình Google Gemini API (Spring AI / Gemini Client SDK) với System Prompt nhập vai chuyên biệt cho gia sư AI Anna.
4. API `POST /api/v1/ai/sessions/{id}/message` xử lý phản hồi thông minh, lưu ngữ cảnh và tiến trình đàm thoại.
5. Xây dựng giao diện Frontend: Phòng luyện thoại với AI (Waveform âm thanh, hiển thị transcript, avatar phản hồi của Anna, Web Speech API).
