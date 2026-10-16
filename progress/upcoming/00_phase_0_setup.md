# ⏳ Phase 0: Setup & Foundation (Tuần 1 – Tuần 2)

> **Mục tiêu**: Thiết lập hoàn chỉnh cấu trúc dự án Full-stack (Backend Spring Boot 3 + Frontend React Vite TypeScript), hệ thống cơ sở dữ liệu (PostgreSQL, MongoDB, Redis) và luồng xác thực người dùng JWT hoàn chỉnh.

---

## 📋 Checklist Công Việc

### 1. Hạ Tầng & Cấu Hình Gốc (Root Infrastructure)
- [x] Khởi tạo Git repo liên kết với GitHub `https://github.com/ducthinhn/ImEnglish.git`
- [x] Tạo file `.gitignore` toàn cục (bảo mật secrets, lọc file rác Maven, Node, OS, IDE)
- [x] Tạo file `docker-compose.yml` (PostgreSQL 16, MongoDB 7, Redis 7, Coturn STUN/TURN)
- [x] Tạo file `.env.example` chuẩn bị tất cả biến môi trường
- [x] Thiết lập hệ thống tài liệu quản lý tiến độ `progress/done` và `progress/upcoming`

### 2. Backend Scaffolding (`imenglish-backend`)
- [x] Khởi tạo Spring Boot 3.x với Java 17/21 (Maven Wrapper)
- [x] Cấu hình dependencies:
  - `spring-boot-starter-web`
  - `spring-boot-starter-security`
  - `spring-boot-starter-data-jpa` (PostgreSQL)
  - `spring-boot-starter-data-mongodb`
  - `spring-boot-starter-data-redis`
  - `spring-boot-starter-validation`
  - `flyway-core` & `flyway-database-postgresql`
  - `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (JWT 0.12.6)
  - `springdoc-openapi-starter-webmvc-ui` (Swagger OpenAPI v3 2.5.0)
  - `mapstruct` & `lombok`
- [x] Thiết lập kiến trúc phân tầng chuẩn: `controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`
- [x] Tạo cấu trúc chuẩn `ApiResponse<T>`:
  ```json
  { "success": true, "message": "...", "data": {...}, "errors": [] }
  ```
- [x] Viết Global Exception Handler (`@RestControllerAdvice`) xử lý validation, unauthorized, resource not found.
- [x] Tạo Flyway migration ban đầu `V1__init_schema.sql` (bảng `users`, `roles`, `user_roles`, `refresh_tokens`, `user_stats`, `friendships`, `p2p_sessions`, `ai_sessions`)

### 3. Authentication & Authorization Module (`/api/v1/auth`)
- [x] `POST /api/v1/auth/register`: Đăng ký tài khoản mới (mã hóa mật khẩu bằng BCrypt, cấp role `ROLE_USER`, khởi tạo `UserStats`)
- [x] `POST /api/v1/auth/login`: Xác thực thông tin, cấp phát Access Token (15 phút) và Refresh Token (7 ngày)
- [x] `POST /api/v1/auth/refresh`: Cấp mới Access Token bằng Refresh Token (Refresh Token Rotation)
- [x] `POST /api/v1/auth/logout`: Thu hồi token và kết thúc session
- [x] Spring Security Filter Chain bảo vệ các endpoint theo JWT Bearer token (`JwtAuthenticationFilter`)

### 4. Frontend Scaffolding (`imenglish-frontend`)
- [x] Khởi tạo React 18+ với Vite và TypeScript
- [x] Cấu hình Tailwind CSS, PostCSS, Lucide React icons, Glassmorphism utilities
- [x] Cài đặt các thư viện lõi:
  - Routing: `react-router-dom`
  - State management: `zustand` (kèm `persist` middleware)
  - Server state / caching: `@tanstack/react-query`
  - HTTP Client: `axios` (kèm Interceptor tự động gắn Bearer Token và silent refresh token khi 401)
  - Form validation: `react-hook-form` + `zod`
- [x] Thiết lập Design System cơ bản: Typography Inter, bảng màu HSL, Dark theme token
- [x] Xây dựng màn hình Đăng Nhập (`/login`) và Đăng Ký (`/register`) chuẩn responsive, kết nối Backend API.

---

## 🎯 Tiêu Chí Nghiệm Thu (Acceptance Criteria)
1. Chạy `docker compose up -d` kích hoạt thành công 3 cơ sở dữ liệu mà không bị crash.
2. Backend compile thành công, Swagger hiển thị đầy đủ tại `http://localhost:8080/swagger-ui.html`.
3. Test đầy đủ các kịch bản đăng ký, đăng nhập và refresh token trên Postman / Swagger.
4. Frontend giao tiếp mượt mà với Backend API qua Axios interceptor.
