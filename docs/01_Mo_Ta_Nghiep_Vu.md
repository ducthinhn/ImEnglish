# 📘 MÔ TẢ NGHIỆP VỤ HỆ THỐNG — ImEnglish

> **Nền tảng Luyện tập Giao tiếp Tiếng Anh kết hợp GenAI & P2P**
> Phiên bản: v1.0 | Tháng 10/2026 | Trạng thái: Draft

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Bối Cảnh & Vấn Đề

Người học tiếng Anh tại Việt Nam thường đối mặt với **hai rào cản tâm lý nghiêm trọng**:

> [!WARNING]
> **Rào cản 1 — Hội chứng "Sợ sai" (Fear of Mistakes)**
> Áp lực tâm lý sợ bị đánh giá khiến người học ngần ngại, không dám mở lời trong các môi trường thực tế. Dẫn đến vòng lặp tiêu cực: **không nói → không tiến bộ → càng sợ hơn**.

> [!WARNING]
> **Rào cản 2 — Sự ngượng ngùng khi kết nối (Awkward Silence)**
> Trên các nền tảng tìm bạn ngôn ngữ hiện tại, ghép cặp hai người lạ thường dẫn đến những khoảng lặng bối rối do **cạn kiệt chủ đề** hoặc **chênh lệch trình độ**, khiến người dùng rời bỏ.

---

### 1.2. Giải Pháp — Hành Trình Tâm Lý 2 Giai Đoạn

```
┌─────────────────────────────────────────────────────────────────┐
│                   HÀNH TRÌNH NGƯỜI DÙNG                         │
│                                                                  │
│  [Giai đoạn 1: Xây dựng tự tin]   →   [Giai đoạn 2: Thực chiến]│
│                                                                  │
│   AI Companion (an toàn)               P2P Connection (thực tế)  │
│   • Không bị phán xét                 • Người thật - Người thật │
│   • Gợi ý khi bí từ                   • Ice-breaker cards       │
│   • Sửa lỗi SAU cuộc trò chuyện       • Cùng trình độ/mục tiêu  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.3. Đối Tượng Người Dùng

| Nhóm | Trình độ | Nhu cầu chính |
|------|----------|---------------|
| Người học mới | A1–A2 | Luyện tập an toàn, không áp lực phán xét |
| Người học trung cấp | B1–B2 | Luyện phản xạ, mở rộng vốn từ giao tiếp |
| Người học nâng cao | C1–C2 | Kết nối người thật, chủ đề chuyên sâu |
| Chuẩn bị IELTS/TOEFL | B2–C1 | Roleplay exam, nhận feedback chi tiết |

---

## 2. PHẠM VI NGHIỆP VỤ

### 2.1. Module 1: AI Companion

#### 2.1.1. Chế Độ Roleplay (Luyện theo Kịch bản)

Người dùng chọn kịch bản từ thư viện → AI đóng vai nhân vật cụ thể → dẫn dắt xử lý tình huống.

**Ví dụ kịch bản:**
- Phỏng vấn xin việc tại công ty Tech
- Đặt bàn và gọi món tại nhà hàng
- Check-in tại sân bay quốc tế
- Check-in khách sạn và hỏi dịch vụ
- Mua sắm và thương lượng giá
- Gặp bác sĩ và mô tả triệu chứng

#### 2.1.2. Chế Độ Free-talk (Trò chuyện tự do)

AI đóng vai **người bạn bản xứ** với tính năng đặc biệt:

> [!TIP]
> **Long-term Memory** — AI ghi nhớ thông tin cá nhân từ các buổi trước và hỏi thăm tự nhiên.
> Ví dụ: *"Hôm nay buổi phỏng vấn của bạn thế nào?"* (AI nhớ bạn đề cập tuần trước)

#### 2.1.3. Real-time Assist

Khi người dùng ngập ngừng → nhấn nút **"Assist"** → nhận ngay **3 gợi ý câu trả lời** ngắn gọn, tự nhiên nhất.

```
Người dùng: "I think... um... the reason is..."
                          ↓ (nhấn Assist)
  Gợi ý 1: "...because the market has changed significantly."
  Gợi ý 2: "...due to the increasing competition in the field."
  Gợi ý 3: "...that we need to adapt our strategy quickly."
```

#### 2.1.4. Feedback Report

**Chỉ sau khi kết thúc** — AI kết xuất báo cáo phân tích đầy đủ:

| Mục | Nội dung |
|-----|----------|
| Điểm tổng thể | 0–100, kèm mô tả cấp độ |
| Lỗi ngữ pháp | Câu gốc → Câu đúng → Giải thích |
| Mẹo phát âm | Các âm cần cải thiện |
| Cách nói tự nhiên hơn | Said → Better → Lý do |
| Từ vựng tốt | Những từ người dùng dùng ấn tượng |
| Mục tiêu tiếp theo | Điểm cần tập trung buổi sau |

---

### 2.2. Module 2: P2P Social Connection

#### 2.2.1. Matching & Voice Call

- Hệ thống **tự động ghép cặp** dựa trên: trình độ + mục tiêu + thời gian chờ
- Gọi thoại trực tiếp qua trình duyệt (**WebRTC** — không qua server)
- Độ trễ thấp, chất lượng audio tốt

#### 2.2.2. Ice-breaker Cards

Ngay khi cuộc gọi bắt đầu, **màn hình hai người đồng bộ** hiển thị nhiệm vụ chung:

```
╔══════════════════════════════════════╗
║  MUSIC EXPLORER                      ║
║                                      ║
║  "Tìm ra 3 bài hát cả hai đều thích  ║
║   trong vòng 5 phút!"                ║
║                                      ║
║  Gợi ý: What's your all-time         ║
║  favorite song?                      ║
╚══════════════════════════════════════╝
```

#### 2.2.3. Cộng Đồng & Nhắn Tin

- Kết bạn sau buổi gọi thành công
- Text chat với danh sách bạn bè
- Trạng thái online/offline
- Lên lịch gặp lại

---

## 3. QUY TRÌNH NGHIỆP VỤ CHÍNH

### 3.1. Đăng Ký & Onboarding

```
[Đăng ký] → [Xác thực email] → [Điền hồ sơ]
     → [Kiểm tra trình độ 10 câu] → [Chọn mục tiêu]
          → [Chọn AI Persona] → [Dashboard]
```

### 3.2. Luyện Tập với AI (Roleplay)

```
1. Chọn kịch bản (filter theo cấp độ/chủ đề)
2. Xem mô tả kịch bản + nhân vật AI
3. Nhấn "Bắt đầu" → Session khởi tạo
4. Nói (Web Speech API → STT → Text)
5. Text gửi Backend → AI xử lý → AI trả lời
6. TTS phát âm câu trả lời
7. [Tùy chọn] Nhấn "Assist" → 3 gợi ý câu
8. Kết thúc → Feedback Report tự động tạo
9. Xem báo cáo chi tiết
```

### 3.3. Kết Nối P2P

```
1. Nhấn "Tìm người luyện tập"
2. Hệ thống đưa vào hàng đợi matching
3. Ghép cặp thành công → Cả hai nhận thông báo
4. WebRTC Signaling: offer → answer → ICE candidates
5. Kết nối P2P thiết lập (trực tiếp, không qua server)
6. Ice-breaker card đồng bộ xuất hiện
7. Trò chuyện tự do
8. Kết thúc → Đánh giá đối phương (1–5 sao)
9. Tùy chọn kết bạn
```

---

## 4. YÊU CẦU PHI CHỨC NĂNG

| Tiêu chí | Yêu cầu | Ghi chú |
|----------|---------|---------|
| API Response | < 200ms (p95) | Không tính AI calls |
| AI Response | < 3 giây (p90) | Streaming response preferred |
| WebRTC Latency | < 300ms RTT | Cần TURN server dự phòng |
| Availability | 99.5% uptime | Ngoại trừ maintenance |
| Concurrent P2P | 500 calls đồng thời | MVP target |
| Bảo mật | OWASP Top 10 | JWT + Rate limiting |
| Scalability | Horizontal scaling | Docker-ready |
| Privacy | Encrypt at rest | Conversation data AES-256 |
