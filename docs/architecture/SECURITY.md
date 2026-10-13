# MÔ HÌNH BẢO MẬT & QUYỀN RIÊNG TƯ (SECURITY & PRIVACY MODEL)

**Dự án:** VietAI Life Platform  
**Tiêu chuẩn:** OWASP Top 10, Zero-Trust Architecture, RBAC Multi-tier, ISO/IEC 27001 Compliance Ready  

---

## 1. Cơ chế Xác thực & Phiên làm việc (Authentication & Session Management)

* **Mã hóa mật khẩu:** Mật khẩu người dùng được băm (hash) bằng giải thuật **Argon2id** hoặc **PBKDF2** với Salt ngẫu nhiên 128-bit. Tuyệt đối không lưu mật khẩu dạng văn bản thô (plain text).
* **Kiến trúc Token kép (Dual Token Architecture):**
  * **Access Token:** JWT ký bằng khóa bí mật RSA-256 / HMAC-SHA256, thời hạn sống ngắn (15 phút), chứa `UserId`, `Email`, `Roles`, `Permissions`.
  * **Refresh Token:** Chuỗi mã hóa ngẫu nhiên 256-bit lưu an toàn trong cơ sở dữ liệu và chuyển về trình duyệt qua **HTTP-Only, Secure, SameSite=Strict Cookie**, thời hạn sống 7 ngày.
* **Đăng xuất tất cả thiết bị (Revoke Sessions):** Cho phép người dùng vô hiệu hóa toàn bộ Refresh Token trên các thiết bị khác khi nghi ngờ lộ thông tin.

---

## 2. Mô hình Phân quyền theo vai trò (Role-Based Access Control - RBAC)

Mọi yêu cầu API đều được kiểm tra quyền tại tầng Backend thông qua Middleware và Authorization Policies:

```
                               ┌──────────────┐
                               │  SuperAdmin  │ (Toàn quyền hệ thống, cấu hình hạ tầng)
                               └──────┬───────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
    ┌───────────┐               ┌───────────┐               ┌───────────┐
    │   Admin   │               │Researcher │               │  Support  │
    └─────┬─────┘               └─────┬─────┘               └─────┬─────┘
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      ▼
                                ┌───────────┐
                                │   User    │ (Người dùng thông thường)
                                └───────────┘
```

| Vai trò (Role) | Quyền hạn chính (Permissions) |
| :--- | :--- |
| **User** | Tạo hội thoại, Upload tài liệu cá nhân, Gọi Agent, Quản lý bộ nhớ cá nhân |
| **Support** | Xem báo cáo lỗi, hỗ trợ người dùng (không xem nội dung chat riêng tư) |
| **Researcher** | Đánh giá Benchmark AI, phân tích độ chính xác RAG (dữ liệu ẩn danh) |
| **ContentManager**| Quản lý tài liệu trong Kho tri thức công khai (VietAI Knowledge Base) |
| **Admin** | Quản lý người dùng, xem Dashboard phân tích chi phí, cấu hình Feature Flags |
| **SuperAdmin** | Toàn quyền kiểm soát hệ thống, phân quyền, quản lý khóa bảo mật |

---

## 3. An toàn tập tin tải lên (File Upload Security Guardrails)

Quy trình 5 lớp kiểm soát trước khi một tập tin được phép lưu trữ:

```
[File Upload Request]
        │
        ▼
1. Size Validation (Tối đa 25MB cho PDF/Office, 10MB cho Ảnh)
        │
        ▼
2. Extension Whitelisting (.pdf, .docx, .txt, .csv, .xlsx, .jpg, .png)
        │
        ▼
3. MIME Type & Magic Bytes Check (Đọc 16 byte đầu của file để xác minh định dạng thật)
        │
        ▼
4. Filename Sanitization (Đổi tên file thành UUID ngẫu nhiên, loại bỏ ký tự Path Traversal "../")
        │
        ▼
5. Storage Isolation (Lưu trữ trên Object Storage riêng, không có quyền thực thi mã execute)
```

---

## 4. Bảo vệ mạng & Phòng chống tấn công (Network & Application Defense)

1. **Chống SQL Injection:** 100% sử dụng Entity Framework Core với Parameterized Queries và LINQ Type-safe.
2. **Chống tấn công XSS & CSRF:**
   * Bật `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`.
   * Mã hóa đầu ra (HTML Sanitization) cho mọi nội dung do AI sinh ra trước khi render.
3. **Chống lạm dụng & Tấn công DoS:**
   * Rate Limit theo IP (60 req/phút).
   * Rate Limit theo tài khoản người dùng cho các API AI tiêu tốn chi phí (20 calls/phút).
4. **Quản lý khóa bí mật (Secret Management):**
   * Tuyệt đối không commit file `.env`, connection string, API key lên GitHub.
   * Quản lý qua biến môi trường hệ điều hành hoặc Azure Key Vault / AWS Secrets Manager.
