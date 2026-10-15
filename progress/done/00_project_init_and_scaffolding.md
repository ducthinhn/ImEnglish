# ✅ Task 00: Khởi Tạo Dự Án & Cấu Hình Nền Tảng (Project Scaffolding)

- **Ngày hoàn thành**: 15/10/2026
- **Trạng thái**: Hoàn thành & Sẵn sàng nghiệm thu
- **Người thực hiện**: Pair Programming (User + Agent)
- **Mục tiêu**: Cấu hình các file cốt lõi ban đầu của toàn dự án, thiết lập hệ thống quản lý tiến độ và kết nối GitHub repository.

---

## 📦 Danh Sách Các File Đã Tạo & Cấu Hình

| File | Chức năng chi tiết |
|---|---|
| [`.gitignore`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/.gitignore) | Bảo vệ bí mật dự án (loại trừ `.env`, secret keys), ngăn chặn commit các file rác sinh ra từ Maven/Gradle (`target/`, `build/`), Node.js (`node_modules/`, `dist/`), OS (`Thumbs.db`, `.DS_Store`) và IDE (`.idea/`, `.vscode/`). |
| [`.env.example`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/.env.example) | File mẫu khai báo đầy đủ các biến môi trường: Database credentials (PostgreSQL, MongoDB, Redis), khóa JWT, AI Provider API Keys (Gemini/OpenAI) và cấu hình STUN/TURN Coturn. |
| [`docker-compose.yml`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/docker-compose.yml) | Cấu hình hạ tầng container dịch vụ local chuẩn: **PostgreSQL 16** (lưu dữ liệu có cấu trúc), **MongoDB 7** (lưu lịch sử chat AI, kịch bản, memory), **Redis 7** (cache, matching queue) và **Coturn** (STUN/TURN server cho WebRTC). Đi kèm healthcheck và persistent volume. |
| [`README.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/README.md) | Tài liệu giới thiệu tổng quan dự án, kiến trúc, sơ đồ công nghệ, cấu trúc thư mục và hướng dẫn khởi chạy nhanh cho lập trình viên. |
| [`progress/README.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/README.md) | Quy chế làm việc 2 chiều: quản lý danh sách việc sắp làm (`upcoming/`) và báo cáo việc đã làm xong (`done/`). |
| [`progress/upcoming/00_phase_0_setup.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming/00_phase_0_setup.md) | Checklist chi tiết các bước tiếp theo của Phase 0 (Spring Boot backend, React frontend, Flyway migration, JWT Auth). |
| [`progress/upcoming/01_phase_1_ai_companion.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming/01_phase_1_ai_companion.md) | Kế hoạch chi tiết Phase 1 (AI Companion, Gemini API, Real-time Assist, Feedback Report). |
| [`progress/upcoming/02_phase_2_p2p_connection.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming/02_phase_2_p2p_connection.md) | Kế hoạch chi tiết Phase 2 (P2P Call, WebRTC, WebSocket STOMP, Matching Queue). |
| [`progress/upcoming/03_phase_3_social_features.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming/03_phase_3_social_features.md) | Kế hoạch chi tiết Phase 3 (Friendship, Messaging). |
| [`progress/upcoming/04_phase_4_and_5_dashboard_launch.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming/04_phase_4_and_5_dashboard_launch.md) | Kế hoạch chi tiết Phase 4 & 5 (Dashboard, Testing, Launch). |

---

## 🔗 Liên Kết Git
- Repository: `https://github.com/ducthinhn/ImEnglish.git`
- Branch: `main`
- Đã liên kết remote `origin`.
