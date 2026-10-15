# 🔌 API DESIGN + KẾ HOẠCH DỰ ÁN — ImEnglish

> REST API · WebSocket · Sprint Plan | v1.0

---

# PHẦN 1: API DESIGN

## Quy Tắc Chung

| Tiêu chí | Quy tắc |
|----------|---------|
| **Base URL** | `https://api.imenglish.com/api/v1` |
| **Auth** | `Authorization: Bearer {access_token}` |
| **Content-Type** | `application/json; charset=UTF-8` |
| **Date format** | ISO 8601: `2026-10-14T10:00:00Z` |
| **Pagination** | `?page=0&size=20&sort=createdAt,desc` |

**Response format thống nhất:**
```json
// Success
{ "success": true,  "message": "...", "data": {...}, "errors": [] }

// Error
{ "success": false, "message": "...", "data": null, "errors": ["detail"] }
```

---

## Auth APIs — `/api/v1/auth`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới | Public |
| `POST` | `/auth/login` | Đăng nhập, nhận JWT | Public |
| `POST` | `/auth/logout` | Đăng xuất, thu hồi refresh token | Required |
| `POST` | `/auth/refresh` | Làm mới access token | HttpOnly Cookie |
| `GET`  | `/auth/verify-email?token=` | Xác thực email | Public |
| `POST` | `/auth/forgot-password` | Yêu cầu reset password | Public |
| `POST` | `/auth/reset-password` | Đặt lại mật khẩu | Public |
| `GET`  | `/auth/google` | OAuth Google redirect | Public |

```json
// POST /auth/login — Request
{ "email": "user@gmail.com", "password": "SecurePass123!" }

// POST /auth/login — Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "expiresIn": 900,
    "user": { "id": "uuid", "username": "john", "englishLevel": "B1" }
  }
}
```

---

## User APIs — `/api/v1/users`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET`   | `/users/me` | Thông tin người dùng hiện tại | Required |
| `PUT`   | `/users/me` | Cập nhật hồ sơ | Required |
| `PATCH` | `/users/me/avatar` | Cập nhật ảnh đại diện (multipart) | Required |
| `GET`   | `/users/me/stats` | Thống kê học tập | Required |
| `POST`  | `/users/me/level-test` | Gửi kết quả kiểm tra trình độ | Required |
| `GET`   | `/users/{id}/profile` | Xem hồ sơ công khai | Required |

---

## AI Companion APIs — `/api/v1/ai`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET`  | `/ai/scenarios` | Danh sách kịch bản (filter + pageable) | Required |
| `GET`  | `/ai/scenarios/{id}` | Chi tiết kịch bản | Required |
| `POST` | `/ai/sessions` | Khởi tạo session AI mới | Required |
| `POST` | `/ai/sessions/{id}/message` | Gửi tin nhắn → nhận reply AI | Required |
| `POST` | `/ai/sessions/{id}/assist` | Nhận 3 gợi ý Real-time Assist | Required |
| `POST` | `/ai/sessions/{id}/end` | Kết thúc session, kích hoạt tạo Report | Required |
| `GET`  | `/ai/sessions` | Lịch sử AI sessions (pageable) | Required |
| `GET`  | `/ai/sessions/{id}/report` | Lấy Feedback Report | Required |
| `GET`  | `/ai/memories` | Xem Long-term Memory | Required |

```json
// POST /ai/sessions — Request
{
  "mode": "ROLEPLAY",
  "scenarioId": "60d5ec49f1b2c8a1234567ab"
}

// POST /ai/sessions/{id}/message — Request
{ "content": "Good morning! I'm here for the interview." }

// POST /ai/sessions/{id}/message — Response
{
  "success": true,
  "data": {
    "role": "assistant",
    "content": "Good morning! Please have a seat. I'm Sarah...",
    "timestamp": "2026-10-14T10:05:00Z"
  }
}
```

---

## P2P APIs — `/api/v1/p2p`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST`   | `/p2p/match/join` | Vào hàng đợi matching | Required |
| `DELETE` | `/p2p/match/leave` | Rời hàng đợi | Required |
| `GET`    | `/p2p/match/status` | Kiểm tra trạng thái matching | Required |
| `GET`    | `/p2p/sessions` | Lịch sử P2P sessions | Required |
| `GET`    | `/p2p/sessions/{id}` | Chi tiết một P2P session | Required |
| `POST`   | `/p2p/sessions/{id}/rate` | Đánh giá đối tác (1–5 sao) | Required |
| `GET`    | `/p2p/icebreaker-cards/random` | Lấy thẻ ice-breaker ngẫu nhiên | Required |

---

## Social APIs — `/api/v1/social`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST`   | `/social/friends/request/{userId}` | Gửi lời mời kết bạn | Required |
| `PUT`    | `/social/friends/request/{userId}/accept` | Chấp nhận lời mời | Required |
| `DELETE` | `/social/friends/request/{userId}/reject` | Từ chối lời mời | Required |
| `DELETE` | `/social/friends/{userId}` | Hủy kết bạn | Required |
| `POST`   | `/social/block/{userId}` | Chặn người dùng | Required |
| `GET`    | `/social/friends` | Danh sách bạn + trạng thái online | Required |
| `GET`    | `/social/friends/requests` | Lời mời đang chờ | Required |
| `GET`    | `/social/messages/{friendId}` | Lịch sử chat (pageable) | Required |

---

## WebSocket Endpoints

**Kết nối:** `ws://api.imenglish.com/ws` (SockJS)
**Protocol:** STOMP over WebSocket
**Auth:** JWT trong header khi kết nối

| Channel | Hướng | Mục đích |
|---------|-------|---------|
| `/app/signal/{roomId}` | Client → Server | Gửi WebRTC signaling (offer/answer/ICE) |
| `/topic/room/{roomId}` | Server → Clients | Nhận signaling từ đối phương |
| `/app/chat/{friendId}` | Client → Server | Gửi tin nhắn chat |
| `/user/queue/messages` | Server → Client | Nhận tin nhắn private |
| `/user/queue/notifications` | Server → Client | Match found, friend request... |
| `/topic/match/{userId}` | Server → Client | Kết quả matching |

```json
// Signaling message qua WebSocket
{ "type": "offer",  "sdp": "v=0\r\n...", "roomId": "room-abc-123" }
{ "type": "answer", "sdp": "v=0\r\n...", "roomId": "room-abc-123" }
{ "type": "ice",    "candidate": { "candidate": "...", "sdpMid": "0" }, "roomId": "..." }
```

---

---

# PHẦN 2: KẾ HOẠCH DỰ ÁN

## Tổng Quan Timeline

```
Tuần:  1  2  3  4  5  6  7  8  9  10 11 12 13 14
       ├──┼──┤  ├──┼──┼──┼──┤  ├──┼──┼──┤  ├──┼──┤  ├──┼──┤  ├──┤
Phase: │ Phase 0│  │    Phase 1    │  │ Phase 2 │  │Ph3│Ph4 │Ph5│
       │Setup  │  │AI Companion   │  │  P2P    │  │   │Pol │Lnch
```

## Phase 0: Setup & Foundation (2 tuần)

| Team | Task |
|------|------|
| BE | Khởi tạo Spring Boot project, cấu hình Docker Compose |
| BE | Flyway migrations: users, friendships, p2p_sessions, ai_sessions |
| BE | Spring Security + JWT auth flow (register, login, refresh) |
| FE | Khởi tạo Vite + React + TypeScript |
| FE | Setup Zustand, TanStack Query, Axios, React Router |
| FE | Màn hình Login/Register UI |
| Infra | GitHub Actions CI/CD pipeline |
| Infra | Docker Compose: PG + MongoDB + Redis + Coturn |

## Phase 1: AI Companion MVP (4 tuần)

| Team | Task |
|------|------|
| BE | `GET /ai/scenarios` — MongoDB integration |
| BE | `POST /ai/sessions` — Khởi tạo AI session |
| BE | `POST /ai/sessions/{id}/message` — Gọi GenAI API, stream response |
| BE | `POST /ai/sessions/{id}/assist` — Real-time suggestions |
| BE | `POST /ai/sessions/{id}/end` + Async Feedback Report generation |
| BE | Long-term Memory: extract + store sau mỗi session |
| FE | Màn hình chọn kịch bản (scenario picker với filter) |
| FE | Màn hình gọi AI (speech interface, push-to-talk) |
| FE | Real-time Assist UI component (3 suggestions popup) |
| FE | Màn hình Feedback Report (tabs: ngữ pháp, phát âm, biểu đạt) |
| Content | Tạo 20+ kịch bản roleplay ban đầu trong MongoDB |

## Phase 2: P2P Connection (3 tuần)

| Team | Task |
|------|------|
| BE | Matching Queue + matching algorithm (Redis-based) |
| BE | WebSocket Signaling Server (Spring STOMP) |
| BE | `POST /p2p/match/join`, `DELETE /p2p/match/leave` |
| BE | P2P session management + ice-breaker card selection |
| FE | Waiting room UI (matching animation) |
| FE | WebRTC integration: peer connection, ICE, SDP |
| FE | P2P call interface với ice-breaker card overlay |
| FE | Màn hình đánh giá + kết bạn sau cuộc gọi |

## Phase 3: Social Features (2 tuần)

| Team | Task |
|------|------|
| BE | Friendship APIs (request, accept, reject, block) |
| BE | Text chat qua WebSocket (private messages) |
| FE | Màn hình quản lý bạn bè |
| FE | Chat interface với real-time updates |
| FE | Notification system (WebSocket push) |

## Phase 4: Dashboard & Polish (2 tuần)

| Team | Task |
|------|------|
| FE | Dashboard: learning stats, streak chart, progress |
| FE | Profile page (public + edit) |
| FE | Onboarding flow (level test UI) |
| BE | User stats aggregation service |
| All | Responsive design, mobile optimization |
| All | Bug fixes, performance optimization |

## Phase 5: Launch Preparation (1 tuần)

| Team | Task |
|------|------|
| Infra | AWS production environment config |
| Infra | Coturn TURN server production setup |
| Infra | Prometheus + Grafana monitoring |
| All | Load testing (k6) — target: 500 concurrent P2P calls |
| All | Security audit, OWASP checklist |
| All | User Acceptance Testing (UAT) |

---

## Risk Matrix

| Rủi ro | Mức độ | Xác suất | Biện pháp |
|--------|--------|----------|-----------|
| WebRTC không kết nối (NAT) | 🔴 Cao | Trung bình | TURN server từ Phase 0, fallback relay |
| Chi phí AI API vượt ngân sách | 🔴 Cao | Trung bình | Rate limiting, model tiering, cache prompts |
| Web Speech API không hỗ trợ Safari | 🟡 Trung bình | Cao | Fallback Whisper API, warn unsupported browsers |
| MongoDB schema thay đổi nhiều | 🟢 Thấp | Cao | App-level validation, version fields |
| Performance matching khi scale | 🟡 Trung bình | Thấp | Redis queue, horizontal scaling sẵn |
| GDPR compliance | 🔴 Cao | Thấp | Encrypt at rest, right-to-deletion API |
