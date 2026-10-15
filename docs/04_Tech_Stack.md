# 🏗️ KIẾN TRÚC & CÔNG NGHỆ — ImEnglish

> System Architecture & Technology Stack | v1.0

---

## 1. TỔNG QUAN KIẾN TRÚC

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)             │
│              Vite · Zustand · TanStack Query · Tailwind      │
└──────────────────┬───────────────────┬──────────────────────┘
                   │ REST API           │ WebSocket (STOMP)
                   │ HTTPS              │ SockJS
                   ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Java 21 + Spring Boot 3.x)        │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  REST API   │  │  WebSocket   │  │    AI Service      │  │
│  │  (HTTP)     │  │  Signaling   │  │  (Gemini/GPT-4o)   │  │
│  └──────┬──────┘  └──────┬───────┘  └────────────────────┘  │
│         │ Spring Security (JWT)                              │
│  ┌──────▼──────────────────────────────────────────────┐    │
│  │              Service Layer (Business Logic)           │    │
│  └──────┬────────────────────┬────────────────────────┘    │
│         │ JPA/Hibernate       │ MongoRepository             │
│  ┌──────▼──────┐      ┌──────▼──────┐   ┌─────────────┐   │
│  │ PostgreSQL  │      │  MongoDB    │   │    Redis    │   │
│  │ (Users,     │      │ (AI data,   │   │  (Cache,    │   │
│  │  Sessions)  │      │  Convs)     │   │   PubSub)   │   │
│  └─────────────┘      └─────────────┘   └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
              P2P Connection (sau khi signaling)
                                │
┌───────────────┐  WebRTC  ┌───────────────┐
│   User A      │◄────────►│   User B      │
│  (Browser)    │ Direct!  │  (Browser)    │
└───────────────┘          └───────────────┘
  Web Speech API              Web Speech API
  (STT + TTS)                 (STT + TTS)
```

---

## 2. BACKEND — JAVA SPRING BOOT

> [!IMPORTANT]
> **Ngôn ngữ chính: Java 21 LTS + Spring Boot 3.3.x**

### 2.1. Tech Stack Backend

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| **Java** | 21 LTS | Ngôn ngữ chính (Records, Sealed Classes, Pattern Matching) |
| **Spring Boot** | 3.3.x | Framework chính, auto-config, embedded Tomcat |
| **Spring Security** | 6.x | JWT auth, authorization, CORS |
| **Spring Data JPA** | 3.3.x | ORM cho PostgreSQL (Hibernate) |
| **Spring Data MongoDB** | 4.x | ODM cho MongoDB |
| **Spring WebSocket** | 6.x | WebSocket server, STOMP, Signaling |
| **Spring AI** | 1.0.x | Tích hợp OpenAI / Gemini |
| **Spring Actuator** | 3.3.x | Health checks, metrics |
| **Flyway** | 10.x | Database migration (PostgreSQL) |
| **MapStruct** | 1.6.x | Entity ↔ DTO mapping auto-generated |
| **Lombok** | 1.18.x | @Data, @Builder, @Slf4j |
| **jjwt** | 0.12.x | JWT create + validate |
| **SpringDoc OpenAPI** | 2.x | Swagger UI auto-generated |
| **Bucket4j** | 8.x | Rate limiting |
| **Maven** | 3.9.x | Build tool |

### 2.2. Package Structure

```
com.imenglish
├── config/
│   ├── SecurityConfig.java
│   ├── WebSocketConfig.java
│   ├── CorsConfig.java
│   └── OpenAPIConfig.java
│
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── AiSessionController.java
│   ├── P2PController.java
│   ├── FriendshipController.java
│   ├── ChatController.java
│   └── ws/SignalingController.java
│
├── service/
│   ├── auth/     AuthService, TokenService
│   ├── user/     UserService
│   ├── ai/       AiSessionService, FeedbackReportService, LongTermMemoryService
│   ├── p2p/      MatchingService, P2PSessionService
│   └── social/   FriendshipService, ChatService
│
├── repository/
│   ├── jpa/      (PostgreSQL JPA Repositories)
│   └── mongo/    (MongoDB Repositories)
│
├── entity/       → JPA Entities (PostgreSQL)
├── document/     → MongoDB Documents
├── dto/
│   ├── request/
│   └── response/
├── mapper/       → MapStruct Mappers
├── security/     → JwtAuthFilter, CustomUserDetailsService
├── exception/    → Custom Exceptions, GlobalExceptionHandler
└── util/         → JwtUtil, PasswordUtil
```

### 2.3. Standard API Response Pattern

```java
// Tất cả API đều trả về format này:
{
  "success": true,
  "message": "Session created successfully",
  "data": { ... },
  "errors": [],
  "timestamp": "2026-10-14T10:00:00Z"
}
```

---

## 3. DATABASE

| Database | Phiên bản | Mục đích | Connection Pool |
|----------|-----------|---------|----------------|
| **PostgreSQL** | 16.x | Dữ liệu có cấu trúc | HikariCP |
| **MongoDB** | 7.x | AI data phi cấu trúc | Spring MongoDB driver |
| **Redis** | 7.x | Cache, Rate limiting, Pub/Sub | Lettuce |

---

## 4. REAL-TIME TECH

| Công nghệ | Dùng cho | Ghi chú |
|-----------|---------|---------|
| **Spring WebSocket + STOMP** | Chat text, WebRTC Signaling | SockJS fallback |
| **WebRTC** | P2P Voice Call thực sự | Không qua server sau khi kết nối |
| **Coturn (TURN Server)** | Relay khi WebRTC direct fail | Tự host hoặc Twilio |
| **STUN (Google)** | ICE candidate discovery | stun.l.google.com:19302 (free) |
| **Web Speech API** | STT + TTS phía client | Browser native, không cần API key |
| **Redis Pub/Sub** | Scale WebSocket horizontally | Khi chạy nhiều instances |

### WebRTC Connection Flow

```
User A                 Spring Signaling              User B
  │                           │                        │
  │── JOIN room ─────────────►│                        │
  │                           │◄─── JOIN room ─────────│
  │◄── user_joined ───────────┤                        │
  │                           │                        │
  │── SDP Offer ─────────────►│── SDP Offer ──────────►│
  │                           │◄── SDP Answer ──────── │
  │◄── SDP Answer ────────────│                        │
  │                           │                        │
  │── ICE candidates ────────►│── ICE candidates ─────►│
  │◄── ICE candidates ────────│◄── ICE candidates ──── │
  │                           │                        │
  │◄══════════ P2P Direct Audio Connection ═══════════►│
  │            (không qua server nữa!)                 │
```

---

## 5. AI STRATEGY — MODEL TIERING

> [!TIP]
> Dùng model nhỏ hơn cho tác vụ đơn giản → **giảm chi phí đáng kể**

| Use Case | Provider | Model | Lý do |
|---------|---------|-------|-------|
| Free-talk conversation | Google | gemini-1.5-pro | Rẻ hơn GPT-4, context dài |
| Memory extraction | Google | gemini-1.5-flash | Nhanh, rẻ, đủ |
| Roleplay (chất lượng cao) | OpenAI | gpt-4o | Roleplay tốt hơn |
| **Real-time Assist** | OpenAI | **gpt-4o-mini** | Rất nhanh + rẻ |
| Feedback Report | OpenAI | gpt-4o | Phân tích sâu cần |
| STT Fallback | OpenAI | whisper-1 | Khi Web Speech API fail |

### AI Cost Control
- Rate limit: **10 AI calls/phút/user**
- Context: Chỉ giữ **20 messages** gần nhất (summarize phần cũ)
- Cache system prompts (scenarios) bằng Redis
- Streaming responses để tránh timeout

---

## 6. FRONTEND — REACT + TYPESCRIPT

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| **React** | 18.x | UI framework |
| **TypeScript** | 5.x (strict) | Type safety |
| **Vite** | 5.x | Build tool siêu nhanh |
| **React Router** | v6 | Client-side routing |
| **Zustand** | 4.x | Global state (auth, call) |
| **TanStack Query** | v5 | Server state, caching |
| **Axios** | 1.x | HTTP client |
| **STOMP.js** | 7.x | WebSocket client |
| **React Hook Form** | 7.x | Form management |
| **Zod** | 3.x | Schema validation |
| **Tailwind CSS** | 3.x | Styling |
| **Framer Motion** | 11.x | Animations |
| **Radix UI** | latest | Accessible components |
| **Recharts** | 2.x | Dashboard charts |

---

## 7. INFRASTRUCTURE & DEVOPS

| Công nghệ | Mục đích | Môi trường |
|-----------|---------|------------|
| **Docker** | Container hóa services | Dev + Prod |
| **Docker Compose** | Orchestration local | Dev only |
| **Kubernetes** | Orchestration production | Prod (future) |
| **GitHub Actions** | CI/CD pipeline | All |
| **AWS EC2** | Hosting backend | Production |
| **AWS S3** | Audio recordings storage | Production |
| **AWS RDS** | PostgreSQL managed | Production |
| **MongoDB Atlas** | MongoDB cloud | Production |
| **Vercel / CloudFront** | Frontend hosting | Production |
| **NGINX** | Reverse proxy | Production |
| **Prometheus + Grafana** | Monitoring | Production |

---

## 8. BẢO MẬT

| Lĩnh vực | Giải pháp | Chi tiết |
|---------|---------|---------|
| **Authentication** | JWT Access + Refresh Token | Access: 15 phút, Refresh: 7 ngày (HttpOnly) |
| **Authorization** | Spring Security RBAC | ROLE_USER, ROLE_ADMIN |
| **Password** | BCrypt (cost=12) | Không lưu plain text |
| **CORS** | Whitelist domains | Cấu hình từng environment |
| **Rate Limiting** | Bucket4j + Redis | 60 req/min, AI: 10/min |
| **Input Validation** | Bean Validation + Sanitize | Chống SQL Injection, XSS |
| **Transport** | HTTPS + TLS 1.3 | Toàn bộ traffic |
| **Secrets** | Env Variables / AWS Secrets | Không hardcode |
| **Data at Rest** | AES-256 encryption | Conversation data |
| **WebRTC** | DTLS-SRTP | Audio P2P end-to-end encrypted |
