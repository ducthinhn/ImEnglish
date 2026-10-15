# ⏳ Phase 2: P2P Speaking Connection (Tuần 7 – Tuần 9)

> **Mục tiêu**: Xây dựng hệ thống ghép cặp luyện nói người thật (P2P Call), máy chủ WebSocket Signaling (Spring STOMP) và kết nối thoại trực tiếp WebRTC client-to-client cùng bộ thẻ Ice-breaker.

---

## 📋 Checklist Công Việc

### 1. Hệ Thống Hàng Đợi Ghép Cặp (Matching Queue)
- [ ] Backend: Redis Queue ghép cặp thông minh theo Level (chênh lệch tối đa 1 bậc) và chủ đề
- [ ] Backend: API `POST /api/v1/p2p/match/join`
- [ ] Backend: API `DELETE /api/v1/p2p/match/leave`
- [ ] Backend: API `GET /api/v1/p2p/match/status`
- [ ] Frontend: Giao diện màn hình chờ tìm kiếm bạn học với radar animation và nút hủy tìm kiếm

### 2. WebSocket Signaling Server & STOMP Protocol
- [ ] Backend: Cấu hình Spring WebSocket STOMP endpoint `/ws`
- [ ] Backend: Xử lý kênh tín hiệu `/app/signal/{roomId}` và phân phối qua `/topic/room/{roomId}`
- [ ] Backend: Xác thực JWT token tại WebSocket handshake
- [ ] Backend: Quản lý vòng đời phòng gọi và giải phóng tài nguyên khi ngắt kết nối

### 3. WebRTC Audio Voice Call
- [ ] Frontend: Triển khai WebRTC Service (RTCPeerConnection, STUN/TURN ICE servers)
- [ ] Frontend: Xử lý SDP Offer / Answer và ICE Candidate trao đổi qua WebSocket
- [ ] Frontend: Giao diện cuộc gọi đàm thoại 2 người với hiệu ứng mic, mute/unmute, và đếm ngược thời gian

### 4. Ice-breaker Cards & Đánh Giá Sau Cuộc Gọi
- [ ] Backend: API `GET /api/v1/p2p/icebreaker-cards/random`
- [ ] Backend: API `POST /api/v1/p2p/sessions/{id}/rate` (chấm 1-5 sao, đánh giá thái độ)
- [ ] Frontend: Card Slider lật câu hỏi Ice-breaker trong lúc đang gọi
- [ ] Frontend: Màn hình Rate Partner & nút Gửi lời mời kết bạn nhanh sau khi kết thúc cuộc gọi
