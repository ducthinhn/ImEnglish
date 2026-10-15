# ⏳ Phase 1: AI Companion MVP (Tuần 3 – Tuần 6)

> **Mục tiêu**: Xây dựng tính năng luyện giao tiếp 1-1 với AI thông minh qua nhận diện giọng nói, tích hợp Google Gemini API, Real-time Assist, Feedback Report và Long-term Memory.

---

## 📋 Checklist Công Việc

### 1. Quản Lý Kịch Bản (Scenarios) & Seed Data
- [ ] Backend: Thiết kế Scenario Document trong MongoDB
- [ ] Backend: API `GET /api/v1/ai/scenarios` (lọc theo topic, level A1–C2, search, phân trang)
- [ ] Backend: API `GET /api/v1/ai/scenarios/{id}`
- [ ] Data: Chuẩn bị 20+ kịch bản roleplay thực tế (Job Interview, Airport, Restaurant, Casual Chat...)
- [ ] Frontend: Giao diện chọn kịch bản với thanh tìm kiếm, bộ lọc trình độ và preview thẻ kịch bản trực quan

### 2. Quản Lý Phiên Luyện Tập Với AI (AI Sessions)
- [ ] Backend: API `POST /api/v1/ai/sessions` (Khởi tạo phiên luyện nói theo kịch bản)
- [ ] Backend: Tích hợp Google Gemini API (Spring AI / Gemini SDK), thiết lập System Prompt nhập vai chuyên biệt
- [ ] Backend: API `POST /api/v1/ai/sessions/{id}/message` (Xử lý hội thoại ngữ cảnh, lưu lịch sử tin nhắn vào MongoDB)
- [ ] Frontend: Giao diện phòng luyện thoại với AI (Waveform âm thanh, hiển thị avatar AI, transcript hội thoại)
- [ ] Frontend: Tích hợp Web Speech API (Speech-to-Text & Text-to-Speech) hoặc Audio streaming

### 3. Trợ Giúp Thời Gian Thực (Real-time Assist)
- [ ] Backend: API `POST /api/v1/ai/sessions/{id}/assist`
  - Nhận ngữ cảnh 3-5 câu gần nhất
  - Prompt AI sinh ra 3 câu trả lời gợi ý tự nhiên theo 3 cấp độ (Đơn giản, Tự tin, Chuyên nghiệp)
- [ ] Frontend: Component Popover Real-time Assist hiển thị khi học viên nhấn nút "Cần gợi ý" hoặc im lặng quá 10s

### 4. Báo Cáo Đánh Giá (AI Feedback Report) & Trí Nhớ Dài Hạn (Long-term Memory)
- [ ] Backend: API `POST /api/v1/ai/sessions/{id}/end`
- [ ] Backend: Xử lý Asynchronous sinh Feedback Report (chấm điểm phát âm, ngữ pháp, từ vựng theo khung CEFR)
- [ ] Backend: Cơ chế trích xuất Long-term Memory (sở thích, lỗi sai lặp lại) lưu vào MongoDB phục vụ các buổi học sau
- [ ] Backend: API `GET /api/v1/ai/sessions/{id}/report` & `GET /api/v1/ai/memories`
- [ ] Frontend: Màn hình hiển thị Feedback Report sinh động với biểu đồ radar và phân tích chi tiết từng lỗi sai
