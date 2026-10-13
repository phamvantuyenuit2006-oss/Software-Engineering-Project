# BÁO CÁO KIỂM TOÁN MÔI TRƯỜNG & HỆ THỐNG (PROJECT AUDIT)

**Dự án:** VietAI Life — Nền tảng AI Agent Thông Minh Dành Cho Người Việt  
**Phiên bản khảo sát:** Phase 0 — Discovery & Foundation  
**Ngày thực hiện:** 04/10/2026  
**Người thực hiện:** Đội ngũ Kỹ sư VietAI Life (Architecture & DevOps)

---

## 1. Môi trường hệ thống thực tế (Environment Inventory)

| Hạng mục | Trạng thái / Phiên bản | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Hệ điều hành** | Windows 11 Pro 64-bit | Môi trường phát triển cục bộ |
| **Node.js Runtime** | `v24.19.0` | Đạt chuẩn hỗ trợ Next.js 15, Turbopack, React 19 |
| **Package Manager** | `npm v11.17.0` | Hỗ trợ Monorepo Workspaces |
| **.NET SDK** | `.NET SDK 10.0.401` | Hỗ trợ C# 13/14, ASP.NET Core Web API, EF Core |
| **Hệ quản trị CSDL** | **Microsoft SQL Server (MSSQLSERVER)** | Dịch vụ `Running` cục bộ, sẵn sàng kết nối qua Windows/SQL Auth |
| **Version Control** | `git version 2.55.0.windows.5` | Sẵn sàng quản lý mã nguồn Monorepo |
| **Docker Engine** | Chưa cài đặt trên PATH cục bộ | Sẽ cấu hình Dockerfile & docker-compose.yml chuẩn để chạy trên staging/CI/CD |
| **AI Providers** | Sẵn sàng cấu hình qua AI Gateway abstraction | Hỗ trợ linh hoạt OpenAI API, Google Gemini, Anthropic, Ollama/Local |

---

## 2. Đánh giá hiện trạng Repository (Repository Audit)

* **Hiện trạng mã nguồn:** Dự án mới (Greenfield Project) — Chưa có mã nguồn cũ bị xung đột.
* **Cấu trúc quản lý:** Sẽ thiết lập theo mô hình **Monorepo** chuẩn:
  * `apps/web`: Next.js Web App & Landing Page
  * `apps/mobile`: React Native / Expo Mobile App (iOS & Android)
  * `services/api`: ASP.NET Core Clean Architecture Backend API
  * `services/ai-agent`: AI Agent Orchestrator Engine & RAG Service
  * `database`: Entity Framework Migrations & SQL Seed Scripts
  * `packages`: Shared DTOs, Types, UI SDK

---

## 3. Ràng buộc kỹ thuật & Tiêu chuẩn kiến trúc (Constraints & Guardrails)

1. **Clean Architecture bắt buộc trên Backend:**
   * Tách bạch 4 tầng: `Domain` $\rightarrow$ `Application` $\rightarrow$ `Infrastructure` $\rightarrow$ `API`.
   * Nguyên tắc phụ thuộc (Dependency Inversion): Tầng Domain không phụ thuộc bất kỳ thư viện bên ngoài nào.
2. **AI Provider Abstraction (`IAIProvider`):**
   * Tuyệt đối không viết mã phụ thuộc cứng (hardcode) vào một nhà cung cấp AI duy nhất.
   * Tất cả các cuộc gọi mô hình (Chat, Vision, Audio, Embedding) đều đi qua AI Gateway Interface.
3. **Bảo mật & Quyền riêng tư (Security & Privacy-First):**
   * Tuyệt đối không commit file `.env`, API Keys, Connection Strings, Certificates lên GitHub.
   * Áp dụng xác thực JWT + Refresh Token, phân quyền RBAC đa tầng tại Backend.
   * Mọi thao tác quan trọng có rủi ro cao phải qua cơ chế **Human-in-the-loop (Xác nhận từ người dùng)**.
4. **Chuẩn chất lượng dữ liệu & Trust Layer:**
   * Không bịa nguồn (no hallucinated sources), không bịa URL, không giả mạo kết quả thực thi.
   * Phân biệt rõ ràng: **FACT** (Dữ liệu xác thực có trích dẫn), **INFERENCE** (Suy luận logic), **OPINION** (Ý kiến), **UNCERTAINTY** (Chưa đủ cơ sở xác thực).

---

## 4. Kết luận kiểm toán

Hệ thống đã chuẩn bị đầy đủ các điều kiện tiên quyết về runtime (.NET 10, Node.js v24, Git, SQL Server). Dự án đủ điều kiện phê duyệt hoàn thành **Phase 0** và tiến hành thiết lập kiến trúc, tài liệu đặc tả và cấu trúc thư mục nền tảng.
