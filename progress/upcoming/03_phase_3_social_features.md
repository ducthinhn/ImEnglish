# ⏳ Phase 3: Social Features (Tuần 10 – Tuần 11)

> **Mục tiêu**: Xây dựng mạng lưới kết nối học viên, danh sách bạn bè, trạng thái online/offline và nhắn tin trực tiếp real-time.

---

## 📋 Checklist Công Việc

### 1. Quản Lý Bạn Bè (Friendship API)
- [ ] Backend: Bảng quan hệ `friendships` và `blocks` trong PostgreSQL
- [ ] Backend: `POST /api/v1/social/friends/request/{userId}` (Gửi lời mời)
- [ ] Backend: `PUT /api/v1/social/friends/request/{userId}/accept` (Chấp nhận)
- [ ] Backend: `DELETE /api/v1/social/friends/request/{userId}/reject` (Từ chối)
- [ ] Backend: `DELETE /api/v1/social/friends/{userId}` (Hủy kết bạn)
- [ ] Backend: `POST /api/v1/social/block/{userId}` (Chặn)
- [ ] Backend: `GET /api/v1/social/friends` (Lấy danh sách bạn bè kèm trạng thái online qua Redis)

### 2. Nhắn Tin Trực Tiếp (Real-time Direct Messaging)
- [ ] Backend: Kênh WebSocket `/app/chat/{friendId}` và `/user/queue/messages`
- [ ] Backend: API `GET /api/v1/social/messages/{friendId}` (Lịch sử trò chuyện có phân trang)
- [ ] Frontend: Giao diện màn hình Friends List & khung chat cá nhân real-time
- [ ] Frontend: Thông báo đẩy real-time (Friend request, incoming message)
