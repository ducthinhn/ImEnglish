# 📋 Quy Trình Quản Lý Tiến Độ Dự Án — ImEnglish

Hệ thống theo dõi tiến độ phát triển được chia làm 2 thư mục rõ ràng nhằm đảm bảo tính minh bạch, bám sát tài liệu thiết kế [`docs/05_API_And_Project_Plan.md`](file:///c:/Users/Dell/OneDrive/Documents/ImEnglish/docs/05_API_And_Project_Plan.md) và dễ dàng kiểm soát chất lượng:

---

## 🗂️ Cấu Trúc Thư Mục

```
progress/
├── README.md                 # Tài liệu này (hướng dẫn & quy chế)
├── upcoming/                 # ⏳ Các tính năng / Phase sắp triển khai
│   ├── 00_phase_0_setup.md
│   ├── 01_phase_1_ai_companion.md
│   ├── 02_phase_2_p2p_connection.md
│   ├── 03_phase_3_social_features.md
│   ├── 04_phase_4_dashboard_polish.md
│   └── 05_phase_5_launch_preparation.md
└── done/                     # ✅ Nhật ký các tính năng đã hoàn thiện & kiểm thử
    └── 00_project_init_and_scaffolding.md
```

---

## ⚙️ Quy Trình Làm Việc Chuẩn (Workflow)

```
[Chọn task từ upcoming/] 
       ↓
[Trình bày giải pháp & file sẽ làm] 
       ↓
[User xác nhận duyệt] 
       ↓
[Thực hiện code & kiểm thử nghiêm ngặt] 
       ↓
[Ghi lại báo cáo kết quả vào done/ & cập nhật upcoming/]
```

1. **Trước khi code một tính năng mới**:
   - Tham chiếu file đặc tả trong `upcoming/`.
   - Lập danh sách các file cần tạo/chỉnh sửa và luồng xử lý.
   - Trình bày cho User duyệt trước khi viết code.

2. **Sau khi tính năng hoàn thành**:
   - Tạo file báo cáo trong `done/` (ví dụ: `done/01_auth_module_completed.md`).
   - Cập nhật checklist trong `upcoming/` (đánh dấu `[x]`).
   - Commit git với message rõ ràng, chuẩn Conventional Commits (ví dụ: `feat(auth): implement jwt login and register`).
