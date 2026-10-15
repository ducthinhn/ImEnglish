# ImEnglish 🎙️🤖

> **Nền tảng luyện tập giao tiếp Tiếng Anh kết hợp AI thông minh (GenAI) và Kết nối Ngang Hàng (P2P Call)**

---

## 🌟 Tính Năng Cốt Lõi
1. **AI Companion (Luyện tập 1-1 với AI)**:
   - Nhập vai đa kịch bản (Phỏng vấn xin việc, Du lịch, Thuyết trình kinh doanh...).
   - Nhận diện giọng nói & đàm thoại real-time.
   - **Real-time Assist**: Gợi ý 3 cách diễn đạt tự nhiên khi người học bị "nghẽn từ".
   - **AI Feedback Report**: Báo cáo chi tiết sau buổi học (Ngữ pháp, phát âm, từ vựng, mức độ lưu loát).
   - **Long-term Memory**: AI ghi nhớ điểm yếu, sở thích và chủ đề của người học qua từng buổi.

2. **P2P Speaking Match (Ghép cặp đàm thoại người thật)**:
   - Hệ thống ghép cặp thông minh dựa trên trình độ (CEFR A1–C2) và chủ đề yêu thích.
   - Gọi thoại WebRTC chất lượng cao, độ trễ cực thấp.
   - **Ice-breaker Cards**: Thẻ gợi ý mở đầu câu chuyện và câu hỏi thảo luận hai bên.
   - Đánh giá văn minh & kết nối bạn học sau cuộc gọi.

3. **Mạng Xã Hội Học Tập & Theo Dõi Tiến Độ**:
   - Quản lý bạn bè, nhắn tin trực tiếp real-time qua WebSocket.
   - Thống kê thời gian luyện nói, chuỗi ngày liên tiếp (streak), phân tích tiến bộ.

---

## 🏗️ Kiến Trúc Công Nghệ

| Thành phần | Công nghệ chính |
|---|---|
| **Backend** | Java 21, Spring Boot 3.x, Spring Security (JWT), Spring WebSocket (STOMP) |
| **Relational Database** | PostgreSQL 16 + Flyway Migration |
| **Document Database** | MongoDB 7 (Lưu trữ AI chats, memories, scenarios, feedback) |
| **In-Memory Cache & Queue**| Redis 7 (Hàng đợi ghép cặp P2P, caching, token blacklist) |
| **Real-time P2P** | WebRTC (Mesh client-to-client) + Coturn (STUN/TURN) |
| **AI / GenAI** | Google Gemini API 1.5 / OpenAI GPT-4 |
| **Frontend** | React 18+, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query |
| **DevOps / Container** | Docker, Docker Compose, GitHub Actions |

---

## 📁 Cấu Trúc Thư Mục Chuẩn

```
ImEnglish/
├── .agents/                 # AI Agent rules & development skills
├── docs/                    # Tài liệu đặc tả nghiệp vụ, database, API, tech stack
├── progress/                # 📌 Quản lý tiến độ triển khai
│   ├── done/                # Các tính năng / module đã hoàn thành (kèm test & log)
│   ├── upcoming/            # Đặc tả chi tiết các feature sắp triển khai theo sprint
│   └── README.md            # Quy chế quản lý tiến độ
├── imenglish-backend/       # Source code Backend (Spring Boot 3.x - Java 21)
├── imenglish-frontend/      # Source code Frontend (React + TypeScript + Vite)
├── docker-compose.yml       # Hạ tầng dịch vụ local (PostgreSQL, MongoDB, Redis, Coturn)
├── .env.example             # Mẫu biến môi trường bảo mật
└── .gitignore               # Cấu hình bỏ qua các file nhạy cảm và build artifacts
```

---

## 🚀 Khởi Chạy Nhanh Hạ Tầng Local

1. **Chuẩn bị file môi trường**:
   ```bash
   cp .env.example .env
   ```

2. **Khởi động các dịch vụ phụ trợ (PostgreSQL, MongoDB, Redis, Coturn)**:
   ```bash
   docker compose up -d
   ```

3. **Kiểm tra trạng thái container**:
   ```bash
   docker compose ps
   ```

---

## 📌 Quản Lý Tiến Độ Phát Triển

Để xem chi tiết lộ trình và các tác vụ đang làm hoặc sắp làm, vui lòng xem thư mục [`progress/`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress):
- [`progress/README.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/README.md): Hướng dẫn quy trình phát triển.
- [`progress/upcoming/`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming): Danh sách task sắp triển khai theo từng Phase.
- [`progress/done/`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/done): Nhật ký các task đã hoàn thiện và kiểm thử thành công.
