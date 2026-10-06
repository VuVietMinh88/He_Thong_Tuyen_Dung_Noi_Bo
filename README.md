# Hệ thống tuyển dụng nội bộ

React + TypeScript cho frontend, Java 21 + Spring Boot 4.1.1 cho backend, PostgreSQL cho dữ liệu. Maven Wrapper dùng cùng một build trong IntelliJ, VS Code, Eclipse và terminal độc lập.

**TKNHTTDNB1-90 — Xây dựng API đăng nhập:** đăng nhập email/mật khẩu, lỗi chung khi sai, khóa 15 phút sau 5 lần sai liên tiếp, trả tên và vai trò. Các API xem tài khoản hiện tại, gia hạn token và đăng xuất hỗ trợ quản lý phiên đăng nhập. Frontend hiện chưa có giao diện.

Backend có thêm tạo/kích hoạt tài khoản, tìm kiếm và cập nhật tài khoản quản trị (145–149), cùng API hồ sơ cá nhân (179–181). V5 bổ sung dữ liệu phòng ban/hồ sơ (148,194), giữ các tài khoản hiện có. Xem [quản trị tài khoản](docs/api/accounts.md) và [hồ sơ cá nhân](docs/api/profile.md) để tích hợp frontend.

Admin có thể [gán và thu hồi từng vai trò](docs/api/account-roles.md) (154–158). Quyền thay đổi ở yêu cầu kế tiếp, dùng lại database và cấu hình hiện có.

## Bắt đầu

1. Chọn JDK 21, đặt `JAVA_HOME` và kiểm tra `java -version`.
2. Mở thư mục dự án này bằng IDE bạn muốn dùng.
3. Trong `backend/`, chạy `./mvnw.cmd verify` trên Windows hoặc `sh ./mvnw verify` trên macOS/Linux. Lần đầu cần tải Maven và thư viện.
4. Muốn chạy API, chuẩn bị PostgreSQL và `backend/.env` theo [hướng dẫn từng bước](docs/getting-started.md).

Test tự khởi động PostgreSQL tạm thời riêng, không cần cài PostgreSQL/Docker và không dùng database trong `.env`.

## Cây thư mục

```text
He_Thong_Tuyen_Dung_Noi_Bo/
├── backend/
│   ├── .mvn/wrapper/         # Phiên bản Maven của cả nhóm
│   ├── mvnw, mvnw.cmd        # Maven cho macOS/Linux và Windows
│   ├── pom.xml               # Java, thư viện, build và coverage
│   ├── .env.example          # Mẫu cấu hình
│   └── src/
│       ├── main/java/vn/ttcs/recruitment/
│       │   ├── account/      # Quản trị tài khoản; profile/ là hồ sơ cá nhân
│       │   ├── auth/         # API đăng nhập và phiên
│       │   ├── security/     # BCrypt, JWT, bảo vệ endpoint, CORS
│       │   ├── common/       # JSON lỗi chung
│       │   └── health/       # Kiểm tra server đang chạy
│       ├── main/resources/   # Cấu hình Spring Boot
│       └── test/java/        # Unit test và test HTTP + PostgreSQL
├── database/
│   ├── migrations/          # SQL thay đổi cấu trúc, Maven đóng gói vào JAR
│   └── seeds/               # Dữ liệu mẫu, hiện mới có file giữ chỗ
├── frontend/                # React + TypeScript, chờ triển khai
├── docs/                    # Hướng dẫn chạy, API, database, Git
├── devops/docker/compose.yaml
└── .vscode/                 # Cấu hình chạy/test tương đối theo workspace
```

Đọc [API đăng nhập](docs/api/auth.md) để thử request và hiểu code theo luồng `Controller → Service → Repository → PostgreSQL`. Xem [quy trình Git](docs/scrum/git-workflow.md) để làm việc với các nhánh và Pull Request.

Sprint 1 và Sprint 2 đã gộp.
