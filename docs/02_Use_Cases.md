# 📋 TÀI LIỆU USE CASES — ImEnglish

> Đặc tả Ca Sử Dụng chi tiết | v1.0

---

## 1. TỔNG QUAN TÁC NHÂN (ACTORS)

| Actor | Loại | Mô tả |
|-------|------|-------|
| **Guest** | Primary | Người dùng chưa đăng nhập |
| **Learner** | Primary | Người dùng đã đăng nhập, dùng AI + P2P |
| **AI System** | Secondary | GenAI API (Gemini/GPT-4) xử lý ngôn ngữ |
| **Matching System** | Secondary | Thuật toán ghép cặp P2P tự động |
| **Admin** | Primary | Quản trị viên hệ thống |

---

## 2. DANH SÁCH 20 USE CASES

| ID | Tên Use Case | Actor | Module | Ưu tiên |
|----|-------------|-------|--------|---------|
| UC01 | Đăng ký tài khoản | Guest | Auth | 🔴 Cao |
| UC02 | Đăng nhập | Guest | Auth | 🔴 Cao |
| UC03 | Xác thực email | Guest | Auth | 🔴 Cao |
| UC04 | Đăng nhập Google OAuth | Guest | Auth | 🟡 Trung bình |
| UC05 | Làm bài kiểm tra trình độ | Learner | Onboarding | 🔴 Cao |
| UC06 | Cập nhật hồ sơ cá nhân | Learner | Profile | 🟡 Trung bình |
| UC07 | Chọn kịch bản Roleplay | Learner | AI Companion | 🔴 Cao |
| UC08 | Luyện tập Roleplay với AI | Learner/AI | AI Companion | 🔴 Cao |
| UC09 | Trò chuyện Free-talk với AI | Learner/AI | AI Companion | 🔴 Cao |
| UC10 | Sử dụng Real-time Assist | Learner/AI | AI Companion | 🔴 Cao |
| UC11 | Xem Feedback Report | Learner | AI Companion | 🔴 Cao |
| UC12 | Tìm kiếm đối tác P2P | Learner | P2P | 🔴 Cao |
| UC13 | Thực hiện cuộc gọi P2P | Learner | P2P | 🔴 Cao |
| UC14 | Xem Ice-breaker Card | Learner | P2P | 🔴 Cao |
| UC15 | Đánh giá đối tác sau cuộc gọi | Learner | P2P | 🟡 Trung bình |
| UC16 | Gửi lời mời kết bạn | Learner | Social | 🟡 Trung bình |
| UC17 | Nhắn tin với bạn bè | Learner | Social | 🟡 Trung bình |
| UC18 | Xem thống kê học tập | Learner | Dashboard | 🟡 Trung bình |
| UC19 | Quản lý người dùng | Admin | Admin | 🔴 Cao |
| UC20 | Quản lý kịch bản AI | Admin | Admin | 🟡 Trung bình |

---

## 3. ĐẶC TẢ CHI TIẾT

### UC08 — Luyện Tập Roleplay với AI

| Trường | Nội dung |
|--------|---------|
| **ID** | UC08 |
| **Actor** | Learner (Primary), AI System (Secondary) |
| **Mô tả** | Người dùng chọn kịch bản và luyện tập hội thoại với AI theo vai diễn |
| **Điều kiện tiên quyết** | Đã đăng nhập; đã chọn kịch bản (UC07); trình duyệt hỗ trợ Web Speech API + Microphone |

**Luồng chính:**
```
1. Người dùng nhấn "Bắt đầu"
2. Hệ thống khởi tạo AI session, lấy system prompt từ kịch bản
3. AI phát câu mở đầu (audio + text hiển thị)
4. Người dùng nói → Web Speech API → STT → Text
5. Text gửi lên Backend → AI xử lý → AI trả lời (stream)
6. TTS phát âm câu trả lời của AI
7. Lặp lại bước 4–6 đến khi kết thúc
8. Nhấn "Kết thúc" → trigger tạo Feedback Report
```

**Luồng thay thế:**
- **A1** — Nhấn "Assist": Hệ thống trả về 3 gợi ý câu (→ UC10)
- **A2** — STT không nhận giọng nói: Hiển thị lỗi, đề nghị thử lại
- **A3** — AI API timeout: Hiển thị thông báo, giữ nguyên session

**Điều kiện hậu:**
- AI session lưu vào MongoDB
- Feedback Report tạo tự động (async)
- User stats cập nhật (số buổi, thời gian)

**Ngoại lệ:**
- **E1** — Mất kết nối internet → Lưu cục bộ, đồng bộ khi có lại
- **E2** — AI API lỗi → Thông báo, cho phép lưu partial session

---

### UC09 — Trò Chuyện Free-talk với AI

| Trường | Nội dung |
|--------|---------|
| **ID** | UC09 |
| **Actor** | Learner (Primary), AI System (Secondary) |
| **Mô tả** | Trò chuyện tự do với AI có tính năng Long-term Memory |
| **Điều kiện tiên quyết** | Đã đăng nhập; microphone được cấp quyền |

**Luồng chính:**
```
1. Chọn "Free-talk" từ menu AI Companion
2. Hệ thống load Long-term Memory của user (từ MongoDB)
3. AI chào hỏi cá nhân hóa (nhắc đến thông tin cũ nếu có)
4. Người dùng nói → STT → gửi Backend
5. Backend kết hợp memory + history → gửi AI → nhận reply
6. AI trả lời, TTS phát âm
7. Sau khi kết thúc: AI extract new memories → lưu MongoDB
8. Feedback Report được tạo
```

**Luồng thay thế:**
- **A1** — Người dùng lần đầu (chưa có memory): AI chào hỏi bình thường và bắt đầu tìm hiểu

---

### UC13 — Thực Hiện Cuộc Gọi P2P Voice

| Trường | Nội dung |
|--------|---------|
| **ID** | UC13 |
| **Actor** | Learner A + Learner B (cả hai Primary) |
| **Mô tả** | Hai người dùng đã ghép cặp thực hiện gọi thoại qua WebRTC |
| **Điều kiện tiên quyết** | Cả hai đã được Matching System ghép cặp (UC12); cả hai đồng ý tham gia; trình duyệt hỗ trợ WebRTC + Microphone |

**Luồng chính:**
```
1. Matching System tạo Room ID, thông báo cả hai qua WebSocket
2. Learner A vào phòng → gửi WebRTC offer (SDP) qua Signaling Server
3. Signaling Server chuyển offer đến Learner B
4. Learner B gửi WebRTC answer
5. Trao đổi ICE candidates qua Signaling Server
6. WebRTC kết nối P2P thiết lập TRỰC TIẾP (không qua server)
7. Ice-breaker card đồng bộ hiển thị cho cả hai (via WebSocket)
8. Hai người trò chuyện qua audio P2P
9. Một trong hai nhấn "Kết thúc" → Session kết thúc
10. Màn hình đánh giá + tùy chọn kết bạn
```

**Luồng thay thế:**
- **A1** — WebRTC direct fail (NAT): Tự động thử TURN server relay
- **A2** — Một người thoát đột ngột: Thông báo cho người còn lại, kết thúc session
- **A3** — Kết nối tệ: Tự động giảm bitrate audio

**Điều kiện hậu:**
- P2P session lưu vào PostgreSQL (duration, ratings)
- Màn hình đánh giá (rating) xuất hiện
- Tùy chọn kết bạn được hiển thị

---

### UC11 — Xem Feedback Report

| Trường | Nội dung |
|--------|---------|
| **ID** | UC11 |
| **Actor** | Learner |
| **Mô tả** | Sau khi kết thúc AI session, xem báo cáo phân tích chi tiết |

**Luồng chính:**
```
1. Sau UC08/UC09, màn hình "Xem báo cáo" xuất hiện
2. Hệ thống hiển thị: điểm tổng thể (gauge chart)
3. Tab "Ngữ pháp": danh sách lỗi với giải thích
4. Tab "Phát âm": mẹo cụ thể theo âm
5. Tab "Diễn đạt": better expressions
6. Tab "Tổng kết": encouragement + next focus
7. Nút "Lưu báo cáo" + "Bắt đầu buổi mới"
```

---

### UC12 — Tìm Kiếm Đối Tác P2P

| Trường | Nội dung |
|--------|---------|
| **ID** | UC12 |
| **Actor** | Learner, Matching System |
| **Mô tả** | Người dùng vào hàng đợi và được ghép cặp tự động |

**Thuật toán Matching:**
```
Tiêu chí ghép cặp (ưu tiên theo thứ tự):
  1. Cùng english_level (A1/A2/B1/B2/C1/C2)
  2. Cùng learning_goal (CONVERSATION/IELTS/BUSINESS...)
  3. Thời gian chờ (tăng dần — chờ lâu hơn = ưu tiên hơn)
  4. Không phải người đã block nhau
  5. Không phải người vừa gọi (trong 10 phút)
```
