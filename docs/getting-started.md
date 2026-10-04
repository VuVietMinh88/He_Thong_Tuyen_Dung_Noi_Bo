# Chạy backend bằng terminal và IDE

JDK chạy và biên dịch Java; Maven tải thư viện và build; PostgreSQL lưu tài khoản. Bạn không cần cài Maven riêng vì dự án có Maven Wrapper. Đọc lần lượt các bước dưới đây trong lần chạy đầu.

## 1. Chọn Java

Dùng **JDK 21**. JDK 25 cũng build được mức mã nguồn Java 21 trong `pom.xml`. Java 8 không chạy được backend. [Yêu cầu chính thức của Spring Boot](https://docs.spring.io/spring-boot/system-requirements.html) xác nhận Spring Boot 4.1.1 hỗ trợ Java 21.

Trong PowerShell, thay đường dẫn ví dụ bằng JDK trên máy bạn:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version
javac -version
cd D:\ttcs_ssnew\He_Thong_Tuyen_Dung_Noi_Bo\backend
```

`JAVA_HOME` trỏ tới thư mục JDK, không phải `bin` hay file `java.exe`. Nếu vẫn hiện `1.8`, terminal đang dùng Java 8. Mở terminal mới sau khi sửa biến môi trường hệ thống. Trên macOS/Linux, chọn JDK 21 rồi vào `backend/`; dùng `sh ./mvnw` thay cho `./mvnw.cmd`.

Máy làm việc hiện tại có JDK 25 tại `D:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\jbr`; có thể đặt `JAVA_HOME` tới đó để chạy ngay, kể cả dùng terminal VS Code. Đây là JDK đã phát hiện trên máy này, không phải đường dẫn bắt buộc cho thành viên khác. Lần kiểm chứng local dùng JDK này, biên dịch với `release 21`.

## 2. Chạy test trước

```powershell
.\mvnw.cmd clean verify
```

Lệnh biên dịch, chạy unit test và API với PostgreSQL tạm thời, tạo file JAR, kiểm tra coverage service tối thiểu 60% cho dòng và nhánh. Database test dùng cổng ngẫu nhiên và dừng sau test. Test tự tạo tài khoản và khóa riêng; không đọc `.env` hoặc dùng database của bạn.

Kết quả ở `backend/target/surefire-reports/`; coverage mở bằng `backend/target/site/jacoco/index.html`. Lần đầu cần Internet tải Maven, thư viện và PostgreSQL phục vụ test; sau đó có thể chạy offline với `-o` nếu cache đầy đủ.

## 3. Tạo cấu hình API

Trong `backend/`, chỉ sao chép khi chưa có `.env`:

```powershell
if (-not (Test-Path -LiteralPath '.env')) {
    Copy-Item -LiteralPath '.env.example' -Destination '.env'
}
```

Mở `backend/.env` và điền:

| Biến | Ý nghĩa |
|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/ttcs` nếu database tên `ttcs` |
| `DB_USERNAME`, `DB_PASSWORD` | Tài khoản PostgreSQL sở hữu database |
| `AUTH_JWT_SECRET` | Chuỗi Base64 của ít nhất 32 byte ngẫu nhiên để ký token |
| `BOOTSTRAP_ADMIN_ENABLED` | `true` trong lần đầu với database chưa có tài khoản |
| `BOOTSTRAP_ADMIN_EMAIL` | Email Admin đầu tiên |
| `BOOTSTRAP_ADMIN_PASSWORD` | Mật khẩu ít nhất 8 ký tự, có chữ/số, tối đa 72 byte UTF-8 |
| `CORS_ALLOWED_ORIGINS` | URL frontend được trình duyệt phép gọi API; mặc định localhost 5173/3000 |

Sinh khóa JWT và tự dán kết quả vào `AUTH_JWT_SECRET`:

```powershell
$jwtKeyBytes = New-Object byte[] 32
$jwtRandom = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$jwtRandom.GetBytes($jwtKeyBytes)
$jwtRandom.Dispose()
[Convert]::ToBase64String($jwtKeyBytes)
```

`.env` được đọc như Java properties: `TEN_BIEN=gia_tri`, không bọc giá trị trong dấu nháy. Nếu mật khẩu có dấu `\`, viết `\\` để giữ một dấu `\`. Có thể dùng biến môi trường thay file. `.gitignore` đã loại `.env` khỏi Git.

Tài khoản PostgreSQL để ứng dụng kết nối database; tài khoản Admin để con người đăng nhập API. Hai tài khoản này khác nhau.

## 4. Chuẩn bị PostgreSQL

Nếu đã cài PostgreSQL, dùng pgAdmin tạo database rỗng `ttcs`, owner là `DB_USERNAME`.

Nếu Docker đã cài và đang chạy, trong `backend/` sau khi điền `.env`:

```powershell
docker compose --env-file .env -f ../devops/docker/compose.yaml up -d postgres
```

Compose chạy PostgreSQL 17 ở localhost cổng 5432 và lưu dữ liệu vào volume. Nếu cổng đã dùng, chọn PostgreSQL đang có hoặc sửa port và `DB_URL` cho khớp. Username/password trong compose chỉ tạo khi volume rỗng; sửa `.env` không đổi mật khẩu database đã tạo.

Dừng container, giữ dữ liệu:

```powershell
docker compose --env-file .env -f ../devops/docker/compose.yaml down
```

Flyway tự tạo bảng từ `database/migrations/` khi chạy lần đầu; không chạy SQL thủ công trước Flyway. Dùng database dành riêng cho dự án mới. Nhiệm vụ này không tự chạy migration trên database làm việc của bạn.

## 5. Chạy API

Trong `backend/`:

```powershell
.\mvnw.cmd spring-boot:run
```

Khi khởi động xong:

```powershell
Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/health'
```

Sau khi Admin được tạo thành công, đặt `BOOTSTRAP_ADMIN_ENABLED=false`, xóa mật khẩu bootstrap trong `.env`. Bootstrap chỉ tạo Admin khi bảng tài khoản rỗng; chạy lại không đặt lại mật khẩu hoặc ghi đè tài khoản sẵn có.

API nghe trên máy local. Nhấn `Ctrl+C` để dừng. Có thể chạy JAR bằng `java -jar target/ttcs-backend-0.0.1-SNAPSHOT.jar`, vẫn từ `backend/` để đọc đúng `.env`. Xem [cách gọi API](api/auth.md) để thử đăng nhập.

## 6. Chọn IDE

### IntelliJ IDEA

1. Mở thư mục gốc, import `backend/pom.xml` dưới dạng Maven project.
2. Chọn Project SDK, Maven Runner JDK là JDK 21, Maven dùng Wrapper.
3. Chạy `TtcsBackendApplication.main()` với **Working directory** là `backend/`.
4. Terminal tích hợp chạy các lệnh giống hướng dẫn ở trên.

### Visual Studio Code

1. **File → Open Folder**, mở `D:\ttcs_ssnew\He_Thong_Tuyen_Dung_Noi_Bo`.
2. Cài các extension được đề xuất: Extension Pack for Java và Spring Boot Extension Pack.
3. **Java: Configure Java Runtime**, chọn JDK 21 cho project. Terminal cần `JAVA_HOME` tương ứng.
4. Chạy `./mvnw.cmd compile` trong `backend/` trước lần debug đầu để SQL vào classpath.
5. **Run and Debug → Run TTCS Backend → F5**. `launch.json` đặt working directory về `backend/`.
6. **Terminal → Run Task → Backend: verify** để build/test hoặc gọi Maven trong terminal.

File `.vscode` dùng đường dẫn tương đối; mỗi người chọn JDK riêng trên máy mình.

### Eclipse và IDE khác

Import **Existing Maven Projects**, chọn `backend/pom.xml`, compiler/JRE là JDK 21, working directory `backend/`. Nếu IDE chưa xử lý Maven resources, chạy `mvnw compile` trước. Build bằng terminal thống nhất cho cả nhóm.

## Lỗi hay gặp

| Hiện tượng | Kiểm tra |
|---|---|
| Java 8 / `release version 21 not supported` | `JAVA_HOME`, `java -version`, `javac -version`, JDK của Maven |
| Không tải được thư viện | Internet, quyền đọc/ghi Maven cache của người chạy |
| PostgreSQL `Connection refused` | Database đang chạy, port, `DB_URL` |
| JWT secret không hợp lệ | Base64 của ít nhất 32 byte ngẫu nhiên |
| Không đọc `.env` | Working directory `backend/` |
| Đúng password vẫn 401 | Có thể đang khóa 15 phút hoặc tài khoản bị vô hiệu hóa |
| Browser chặn CORS | Frontend URL, gồm scheme và port, phải khớp cấu hình |

Mở/debug trực tiếp trong từng IDE và chạy Docker cần xác nhận trên môi trường của bạn. Test HTTP + PostgreSQL kiểm chứng backend; không thay thế kiểm tra giao diện IDE.
