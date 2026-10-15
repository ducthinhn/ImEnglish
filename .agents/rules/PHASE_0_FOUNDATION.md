# 📐 Phase 0: Foundation & Setup — Rules & Coding Guidelines

Tài liệu này định nghĩa các quy tắc cốt lõi (Rules) và tiêu chuẩn kỹ thuật (Standards) bắt buộc áp dụng khi triển khai các module trong **Phase 0** của dự án ImEnglish (dựa theo [progress/upcoming/00_phase_0_setup.md](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/progress/upcoming/00_phase_0_setup.md)).

---

## ☕ 1. Backend Standards (`imenglish-backend`)

### 1.1. Công Nghệ & Khởi Tạo
- **Framework**: Spring Boot 3.x trên nền Java 17 hoặc Java 21 LTS.
- **Build tool**: Maven (`pom.xml`) có Maven Wrapper (`./mvnw`).
- **Base Package**: `com.imenglish`
- **Cấu hình**: Sử dụng `src/main/resources/application.yml`, đọc các biến cấu hình từ biến môi trường (khớp với `.env.example`).

### 1.2. Phân Tầng Trách Nhiệm (Layered Architecture)
- **`controller`**: Chỉ tiếp nhận HTTP request, validate dữ liệu với `@Valid`, gọi Service và trả về `ResponseEntity<ApiResponse<T>>`. Tuyệt đối không viết logic nghiệp vụ tại Controller.
- **`service`**: Chứa toàn bộ business logic. Phải tách interface và class triển khai `ServiceImpl`. Sử dụng `@Transactional` tại tầng này.
- **`repository`**: Kế thừa `JpaRepository` (PostgreSQL) hoặc `MongoRepository` (MongoDB). Không viết logic tính toán tại đây.
- **`entity` / `document`**: Định nghĩa bảng PostgreSQL và collection MongoDB. Không bao giờ trả trực tiếp Entity về client.
- **`dto`**: Chia tách rõ ràng `request/` (ví dụ: `RegisterRequest`, `LoginRequest`) và `response/` (ví dụ: `AuthResponse`, `UserResponse`).
- **`mapper`**: Sử dụng MapStruct để chuyển đổi giữa Entity và DTO.
- **`exception`**: Chứa các Exception tùy biến (`AppException`, `ResourceNotFoundException`, `UnauthorizedException`) và `GlobalExceptionHandler` (`@RestControllerAdvice`).
- **`config`**: Chứa cấu hình Spring Security, CORS, Swagger OpenAPI, Redis, Auditing.

### 1.3. Chuẩn Hóa API Response & Exception
Mọi REST API đều phải bọc dữ liệu trong `ApiResponse<T>`:
```json
// Thành công
{
  "success": true,
  "message": "User registered successfully",
  "data": { ... },
  "errors": []
}

// Thất bại
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": ["Email is already in use", "Password must be at least 8 characters"]
}
```

### 1.4. Cơ Sở Dữ Liệu & Flyway Migration
- Sử dụng Flyway để quản lý schema version của PostgreSQL.
- Thư mục migrations: `src/main/resources/db/migration/`
- Đặt tên file: `V{version}__{description}.sql` (ví dụ: `V1__init_schema.sql`, `V2__create_friendships.sql`).
- Schema ban đầu `V1__init_schema.sql` phải bao gồm:
  - Bảng `users` (id UUID, email, password_hash, username, avatar_url, english_level, status, created_at, updated_at).
  - Bảng `roles` và `user_roles` (ADMIN, USER).
  - Bảng `refresh_tokens` (id, user_id, token_hash, expires_at, revoked).

### 1.5. Bảo Mật & JWT Authentication Flow
- Thuật toán ký JWT: `HS256` hoặc `HS512` với `io.jsonwebtoken` (JJWT).
- Access Token: Hết hạn sau 15 phút. Gửi trong HTTP header `Authorization: Bearer <token>`.
- Refresh Token: Hết hạn sau 7 ngày. Hỗ trợ cơ chế Refresh Token Rotation (cấp lại cặp token mới và thu hồi token cũ khi refresh).
- Password Hashing: Bắt buộc dùng `BCryptPasswordEncoder` (độ dài work factor 10 hoặc 12).
- Cấu hình CORS: Cho phép nguồn gốc từ frontend (`http://localhost:5173`).

---

## ⚛️ 2. Frontend Standards (`imenglish-frontend`)

### 2.1. Công Nghệ & Khởi Tạo
- **Core**: React 18+ với Vite và TypeScript (chế độ strict mode).
- **Styling**: Tailwind CSS + Lucide React (bộ icon nhất quán).
- **Routing**: `react-router-dom` v6+.
- **State Management**: Zustand (quản lý state đăng nhập, user session).
- **Server Cache / Fetching**: `@tanstack/react-query` v5.

### 2.2. Kiến Trúc Thư Mục Chuẩn
```
src/
├── api/             # Axios client, interceptors, và các hàm gọi API theo module
├── components/      # UI components tái sử dụng (Button, Input, Modal, Alert...)
├── features/        # Các module tính năng (auth, dashboard, ai, p2p...)
│   └── auth/
│       ├── components/
│       ├── hooks/
│       └── pages/ (LoginPage, RegisterPage)
├── layouts/         # Layout chung (AuthLayout, MainLayout, Header, Sidebar)
├── stores/          # Zustand stores (useAuthStore.ts)
├── types/           # Type definitions TypeScript (User, ApiResponse, AuthTokens)
└── utils/           # Helper functions, formatters, validation schemas
```

### 2.3. Axios Interceptor Pattern
- Tự động gắn Access Token vào header `Authorization: Bearer ...` trước mỗi request.
- Tự động bắt lỗi HTTP `401 Unauthorized`:
  - Gọi endpoint `/api/v1/auth/refresh` lấy Access Token mới.
  - Tự động thực hiện lại (retry) request vừa bị lỗi ban đầu.
  - Nếu refresh thất bại, xóa trạng thái đăng nhập trong Zustand store và điều hướng người dùng về trang `/login`.

### 2.4. Form Validation & UX Standards
- Sử dụng `react-hook-form` kết hợp schema `zod` cho tất cả form nhập liệu.
- Hiển thị thông báo lỗi rõ ràng ngay dưới trường nhập liệu (inline error).
- Hiển thị trạng thái loading spinner trên nút Submit trong lúc request đang gửi.
- Thiết kế giao diện hiện đại, responsive hoàn hảo trên cả desktop và mobile.

---

## 🚫 3. Các Điều Cấm (Strict Prohibitions)
1. Tuyệt đối không commit file `.env` hoặc hardcode password/secret key trong mã nguồn.
2. Không trả trực tiếp Entity của JPA hoặc Document của MongoDB ra API Response.
3. Không bỏ qua bước kiểm tra bean validation (`@Valid`).
4. Không viết logic gọi database trực tiếp trong Controller.
