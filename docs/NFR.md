# NON-FUNCTIONAL REQUIREMENTS (NFR) — VIETAI LIFE

Tài liệu này xác định các yêu cầu phi chức năng cấp Production cho nền tảng VietAI Life, bao gồm hiệu năng, bảo mật, khả năng mở rộng, độ tin cậy và chuẩn trợ năng.

---

## 1. Hiệu năng & Độ trễ (Performance & Latency)

| Chỉ số | Mục tiêu chuẩn | Giải pháp kiến trúc |
| :--- | :--- | :--- |
| **API Response (CRUD thông thường)** | $< 150\text{ ms}$ (p95) | ASP.NET Core tối ưu, EF Core Compiled Queries, Redis Cache |
| **Thời gian bắt đầu Stream AI (TTFT)** | $< 800\text{ ms}$ | Sử dụng Server-Sent Events (SSE) và kết nối HTTP/2 Streaming |
| **Tìm kiếm RAG (Vector + Keyword Search)** | $< 350\text{ ms}$ | HNSW Index trên Vector Database + Fulltext Index |
| **Xử lý tài liệu nền (PDF/DOCX 50-100 trang)** | Hoàn thành $< 30\text{ s}$ | Đẩy vào hàng đợi nền (Background Worker / Message Queue) |
| **Giao diện Web (Core Web Vitals)** | LCP $< 2.0\text{ s}$, CLS $< 0.1$ | Next.js Server Components, tối ưu hóa ảnh, CDN Static Assets |

---

## 2. Khả năng mở rộng (Scalability Roadmap)

Hệ thống được thiết kế theo kiến trúc phi trạng thái (Stateless Services) để mở rộng tuần tự theo lộ trình:
* **Giai đoạn 1 (MVP):** Hỗ trợ $1.000$ người dùng đồng thời trên kiến trúc đơn giản (Single Docker Host / App Service + Managed SQL Server).
* **Giai đoạn 2 (Growth):** Mở rộng $10.000 - 100.000$ người dùng với Kubernetes (K8s) Cluster, Read-Replicas cho Cơ sở dữ liệu và cụm Vector Database chuyên dụng.
* **Giai đoạn 3 (Enterprise):** Hỗ trợ $1.000.000+$ người dùng qua Multi-region Deployment, CDN Caching toàn diện và Event-driven Architecture (Kafka/RabbitMQ).

---

## 3. Bảo mật & Quyền riêng tư (Security & Privacy Standard)

1. **Kiểm soát xác thực & Ủy quyền (AuthN & AuthZ):**
   * Xác thực bằng JWT (Access Token thời hạn 15 phút, Refresh Token lưu an toàn trong HTTP-only Cookie).
   * Cơ chế phân quyền RBAC (Role-Based Access Control) bắt buộc kiểm tra tại Backend API (không phụ thuộc vào giao diện Frontend).
2. **Bảo vệ chống các lỗ hổng OWASP Top 10:**
   * **SQL Injection:** 100% truy vấn qua Entity Framework Core tham số hóa (Parameterized Queries).
   * **XSS & CSRF:** Content Security Policy (CSP), mã hóa đầu ra (Output Encoding), SameSite Cookies.
   * **Rate Limiting:** Giới hạn 60 requests/phút/IP cho API công khai và 20 requests AI/phút/User để chống tấn công từ chối dịch vụ (DDoS) và lạm dụng chi phí.
3. **An toàn tập tin tải lên (File Upload Guardrails):**
   * Kiểm tra MIME Type thực tế kết hợp đọc Magic Bytes (Header bytes của file).
   * Giới hạn dung lượng: Tối đa 25MB cho tài liệu, 10MB cho hình ảnh.
   * Lưu trữ tại Object Storage riêng biệt, không lưu trực tiếp vào database, không cho phép thực thi mã từ thư mục lưu trữ.
4. **Quyền riêng tư & Quản trị dữ liệu người dùng:**
   * Người dùng có toàn quyền: **Xem dữ liệu cá nhân**, **Xuất dữ liệu (Data Export)**, **Xóa toàn bộ lịch sử (Data Deletion)**, và **Tắt tính năng ghi nhớ (Memory Opt-out)**.
   * Tuyệt đối không sử dụng dữ liệu hội thoại riêng tư của người dùng để huấn luyện mô hình nếu chưa có sự đồng thuận rõ ràng (Consent).

---

## 4. Độ sẵn sàng & Khả năng phục hồi (Reliability & Fault Tolerance)

* **SLA mục tiêu:** Đạt tối thiểu $99.9\%$ Uptime.
* **AI Provider Failover & Circuit Breaker:** Khi nhà cung cấp AI chính gặp sự cố (Rate limit / Timeout), AI Gateway tự động chuyển tiếp sang nhà cung cấp dự phòng qua mẫu hình Retry với Exponential Backoff.
* **Database Backup:** Thiết lập sao lưu tự động hàng ngày (Automated Point-in-time Recovery).

---

## 5. Chuẩn Trợ năng & Tính bao hàm (Accessibility & Inclusion)

* Tuân thủ chuẩn quốc tế **WCAG 2.1 Cấp độ AA**:
  * Tỷ lệ tương phản màu sắc đạt tối thiểu 4.5:1 cho văn bản tiêu chuẩn.
  * Hỗ trợ điều hướng 100% bằng phím (Tab, Enter, Escape, Arrow keys).
  * Tương thích hoàn toàn với các phần mềm đọc màn hình (Screen Readers: NVDA, VoiceOver).
  * Hỗ trợ chế độ phóng to chữ (Font Scaling lên tới 200% không vỡ giao diện).
