# Hợp Đồng API (API Contract) - Quản Trị Danh Sách Tài Khoản

**Mã công việc:** TKNHTTDNB1-142, TKNHTTDNB1-150, TKNHTTDNB1-160  
**Tác giả:** Frontend Module Quản trị Tài khoản  
**Phiên bản:** 1.0.0  

---

## 1. Endpoint: Lấy danh sách tài khoản (Phân trang & Tìm kiếm)

- **Method:** `GET`
- **Path:** `/api/admin/accounts`
- **Xác thực:** Bearer Token (`Authorization: Bearer <accessToken>`)
- **Yêu cầu quyền:** `MANAGE_USERS` hoặc Role `ADMIN`

### Query Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `number` | Không | `1` | Số trang cần lấy (bắt đầu từ 1) |
| `size` | `number` | Không | `10` | Số lượng bản ghi trên một trang (5, 10, 20, 50) |
| `search` | `string` | Không | `""` | Từ khóa tìm kiếm theo họ tên hoặc email |
| `role` | `string` | Không | `""` | Lọc theo vai trò (`ADMIN`, `HR`, `INTERVIEWER`, `EMPLOYEE`) |
| `status` | `string` | Không | `""` | Lọc theo trạng thái (`ACTIVE`, `LOCKED`) |

### Response Thành công (HTTP 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "acc-001",
      "fullName": "Nguyễn Văn An",
      "email": "an.nguyen@company.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2026-01-15T08:30:00Z",
      "lastLoginAt": "2026-10-01T14:20:00Z"
    },
    {
      "id": "acc-002",
      "fullName": "Trần Thị Mai",
      "email": "mai.tran@company.com",
      "role": "HR",
      "status": "ACTIVE",
      "createdAt": "2026-02-10T09:15:00Z",
      "lastLoginAt": "2026-09-30T10:05:00Z"
    },
    {
      "id": "acc-003",
      "fullName": "Lê Hoàng Nam",
      "email": "nam.le@company.com",
      "role": "EMPLOYEE",
      "status": "LOCKED",
      "createdAt": "2026-03-05T11:45:00Z",
      "lastLoginAt": "2026-08-15T16:50:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "totalElements": 25,
    "totalPages": 3
  }
}
```

## 2. Endpoint: Cập nhật thông tin tài khoản (TKNHTTDNB1-144)

- **Method:** `PUT`
- **Path:** `/api/admin/accounts/{id}`
- **Xác thực:** Bearer Token (`Authorization: Bearer <accessToken>`)
- **Yêu cầu quyền:** `MANAGE_USERS` hoặc Role `ADMIN`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `string` / `number` | Có | Mã định danh tài khoản cần cập nhật |

### Request Body (JSON)
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả & Quy tắc kiểm tra (Validation) |
| :--- | :--- | :--- | :--- |
| `fullName` | `string` | Có | Họ và tên người dùng (2 - 100 ký tự, không chứa ký tự đặc biệt) |
| `email` | `string` | Có | Địa chỉ email công ty hợp lệ (định dạng chuẩn email RFC 5322) |

```json
{
  "fullName": "Nguyễn Văn An",
  "email": "an.nguyen@company.com"
}
```

### Response Thành công (HTTP 200 OK)
```json
{
  "success": true,
  "data": {
    "id": "acc-001",
    "fullName": "Nguyễn Văn An",
    "email": "an.nguyen@company.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-01-15T08:30:00Z",
    "lastLoginAt": "2026-10-01T14:20:00Z"
  },
  "message": "Cập nhật thông tin tài khoản thành công."
}
```

### Response Lỗi
- **HTTP 400 Bad Request:** Dữ liệu không hợp lệ (họ tên rỗng, email sai định dạng hoặc email đã được sử dụng bởi tài khoản khác).
  ```json
  {
    "success": false,
    "message": "Email đã tồn tại trong hệ thống.",
    "errors": {
      "email": "Email an.nguyen@company.com đã được đăng ký bởi tài khoản khác."
    }
  }
  ```
- **HTTP 401 Unauthorized:** Phiên đăng nhập hết hạn hoặc chưa đăng nhập.
- **HTTP 403 Forbidden:** Người dùng không có quyền quản lý tài khoản (`MANAGE_USERS` / `ADMIN`).
- **HTTP 404 Not Found:** Không tìm thấy tài khoản với ID yêu cầu.
- **HTTP 500 Internal Server Error:** Lỗi phía máy chủ cơ sở dữ liệu.

