# VIETAI LIFE — HỆ THỐNG THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ
## ĐỒ ÁN CÔNG NGHỆ PHẦN MỀM (SOFTWARE ENGINEERING)
> **Giảng viên hướng dẫn:** **ThS. Nguyễn Quốc Huy**  
> **Tác giả sáng lập & Sở hữu bản quyền:** **[Tuyên Phạm](https://github.com/phamvantuyenuit2006-oss)** ([@phamvantuyenuit2006-oss](https://github.com/phamvantuyenuit2006-oss)) &bull; Email: `phamvantuyenuit2006@gmail.com`  
> **Đề tài chính thức:** **Thuyết minh tự động đa ngôn ngữ (Automated Multilingual Narration System)**  
> **Báo cáo đồ án chi tiết:** 📄 [Xem Báo Cáo Đồ Án Hoàn Chỉnh](docs/BAO_CAO_DO_AN_CNPM_THUYET_MINH_DA_NGON_NGU.md)

[![Course](https://img.shields.io/badge/Course-C%C3%B4ng%20Ngh%E1%BB%87%20Ph%E1%BA%A7n%20M%E1%BB%81m-blue.svg)](docs/BAO_CAO_DO_AN_CNPM_THUYET_MINH_DA_NGON_NGU.md)
[![Instructor](https://img.shields.io/badge/Instructor-ThS.%20Nguy%E1%BB%85n%20Qu%E1%BB%91c%20Huy-red.svg)](docs/BAO_CAO_DO_AN_CNPM_THUYET_MINH_DA_NGON_NGU.md)
[![Author](https://img.shields.io/badge/Author-Tuy%C3%AAn%20Ph%E1%BA%A1m-blue?logo=github)](https://github.com/phamvantuyenuit2006-oss)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015%20%2F%20React%20Native-black.svg)](apps/web/)
[![Backend](https://img.shields.io/badge/Backend-.NET%2010%203--Tier%20%26%20Microservices-purple.svg)](services/api/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions%20Automated-brightgreen.svg)](.github/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 1. Giới thiệu tổng quan (What is VietAI Life?)

**VietAI Life** là hệ sinh thái trợ lý AI toàn năng cấp Production, kết hợp hài hòa giữa **nền tảng công nghệ AI hiện đại chuẩn quốc tế** và **đời sống thực tế của người dân Việt Nam**. 

Hệ thống sở hữu nhân vật trợ lý ảo thân thiện **Bé Mai**, tích hợp trực tiếp siêu trí tuệ **DeepSeek-V3 Live AI**, cho phép người dùng hỏi và nhận câu trả lời cho **mọi thắc mắc trong đời sống**: từ nấu ăn, sức khỏe, quản lý tài chính cá nhân, làm thủ tục hành chính VNeID, tới giải toán, lập trình Python chuẩn giáo trình **AI VIET NAM (AIO Academy)**.

```
                      ┌─────────────────────────────────┐
                      │          VIETAI LIFE            │
                      │  Trợ lý Đời sống Người Việt     │
                      └────────────────┬────────────────┘
                                       │
     ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
     ▼                  ▼              ▼              ▼                  ▼
[HỎI GÌ ĐÁP NẤY]   [DINH DƯỠNG MÓN    [CHI TIÊU &      [DỊCH VỤ CÔNG &    [KỸ THUẬT AI
 (DEEPSEEK V3)]     VIỆT 360]          THUẾ 2026]       VNeID THỦ TỤC]     AIO ACADEMY]
  - Live AI 24/7     - Calo 500+ món    - Voice-to-exp   - Đăng ký tạm trú  - 12 Module AIO
  - Giọng nói 2 chiều - BMI & Nước       - VietQR 24/7    - Căn cước mới     - PyTorch Sim
  - Vision AI scan   - Mâm cơm 50-200k  - Thuế TNCN Net  - Đổi GPLX online  - RAG Pipeline
```

---

## 🚀 2. Các Trụ Cột Tính Năng Đột Phá

### 🌸 A. Trợ Lý Bé Mai — Hỏi Gì Đáp Nấy (Omni-AI Live)
* **Trí tuệ nhân tạo DeepSeek-V3:** Trả lời trực tiếp, thông minh, sâu sắc mọi câu hỏi từ khoa học, toán học, lập trình, văn học, đến tâm sự đời thường.
* **Tương tác giọng nói tiếng Việt 2 chiều:**
  * 🎙️ **Speech-to-Text:** Nói trực tiếp bằng giọng 3 miền Bắc - Trung - Nam.
  * 🔊 **Text-to-Speech:** Bé Mai đọc to câu trả lời bằng giọng truyền cảm ấm áp.
* **Thị giác máy tính (Vision AI & Smart OCR):** Quét ảnh tô phở/món ăn để bóc tách calo và quét ảnh hóa đơn chợ/siêu thị để tự động ghi sổ.

### 🍲 B. Dinh Dưỡng & Bếp Nhà 360 (Viet Health & Cuisine)
* **Tra cứu 500+ món ăn Việt:** Bảng dữ liệu chuẩn Viện Dinh Dưỡng (Phở bò, cơm tấm, bún chả, bún bò, bánh mì...).
* **Bảng theo dõi BMI & Lượng nước thông minh:** Đề xuất lượng nước uống theo thể trạng cá nhân (Cân nặng &times; 40ml).
* **Lên mâm cơm theo ngân sách:** Thực đơn 3 món chuẩn vị theo các mức ngân sách 50k, 100k, 150k, 200k cho gia đình.

### 💰 C. Sổ Tay Chi Tiêu Thông Minh & Thuế TNCN 2026
* **Voice-to-Expense:** Nói câu tự nhiên (*"Trưa nay ăn bún bò 45 nghìn"*) &rarr; AI tự động ghi nhận vào ví 6 chiếc lọ.
* **Tạo mã VietQR tức thì:** Hỗ trợ sinh mã chuyển khoản NAPAS 247 cho tất cả các ngân hàng (VCB, MB, Techcombank, Momo).
* **Tính lương Gross sang Net:** Công cụ tính thuế thu nhập cá nhân lũy tiến từng phần và bảo hiểm bắt buộc theo luật mới nhất.

### 🏛️ D. Cẩm Nang Dịch Vụ Công & VNeID
* Hướng dẫn 4 bước đăng ký tạm trú trực tuyến qua app VNeID Mức 2.
* Hướng dẫn cấp thẻ Căn cước mới theo Luật Căn cước 2024.
* Đổi Giấy phép lái xe trực tuyến Mức 4 nhận kết quả tại nhà qua bưu điện.

### 🎓 E. Học Viện & Kỹ Thuật AI VIỆT NAM (AIO 2026)
* **12 Module Kỹ Sư AI chuyên nghiệp:** Lộ trình từ Python & Toán cho AI đến Deep Learning, Computer Vision (CVPR-W), NLP (PhoBERT) và LLM Agents.
* **PyTorch Simulator:** Mô phỏng huấn luyện mạng Nơ-ron, log Loss & Accuracy theo thời gian thực mô phỏng TensorBoard.

---

## 🛠️ 3. Kiến Trúc Kỹ Thuật (System Architecture)

* **Giao diện (Frontend):** Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Glassmorphism UI.
* **Trí tuệ nhân tạo (AI Engine):** DeepSeek-V3 API, Google Gemini Live, Web Speech API (STT & TTS), Vision OCR Engine.
* **Hệ thống Backend (API Core):** ASP.NET Core (.NET 10), Clean Architecture, CQRS (MediatR), Entity Framework Core.
* **Cơ sở dữ liệu:** Microsoft SQL Server, InMemory Vector Store, Redis Cache.

---

## 🏁 4. Hướng Dẫn Khởi Động Nhanh (Quickstart)

### Cách 1: Khởi động 1-Click trên Windows
Nhấp đúp chuột vào file:
```cmd
Chay-VietAI-Life.bat
```
Hệ thống sẽ tự động khởi động máy chủ và mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

### Cách 2: Chạy Frontend (Next.js)
```bash
cd apps/web
npm install
npm run build
npm start
# Hoặc chạy chế độ phát triển:
# npm run dev
```

### Cách 3: Cấu hình API Key (Tùy chọn)
Tạo file `apps/web/.env.local`:
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📚 5. Hệ Thống Tài Liệu Kỹ Thuật (Docs Sitemap)

* 📄 [Bản Thiết Kế Toàn Diện (VIETAI_LIFE_MASTER_BLUEPRINT.md)](docs/VIETAI_LIFE_MASTER_BLUEPRINT.md)
* 🏗️ [Kiến Trúc Hệ Thống Tổng Thể (ARCHITECTURE.md)](docs/architecture/ARCHITECTURE.md)
* 🤖 [Kiến Trúc Cỗ Máy AI Agent Engine (AI_AGENT.md)](docs/architecture/AI_AGENT.md)
* 🔍 [Kiến Trúc RAG Pipeline & Trust Layer (RAG.md)](docs/architecture/RAG.md)
* 🛡️ [Mô Hình Bảo Mật & An Ninh Dữ Liệu (SECURITY.md)](docs/architecture/SECURITY.md)
* 🗄️ [Thiết Kế Cơ Sở Dữ Liệu ERD (ERD.md)](docs/database/ERD.md)

---

## 👤 Tác Giả & Sở Hữu Bản Quyền (Author & Copyright)

* **Tác giả & Chủ sở hữu:** **Tuyên Phạm** ([@phamvantuyenuit2006-oss](https://github.com/phamvantuyenuit2006-oss))
* **Email liên hệ:** [phamvantuyenuit2006@gmail.com](mailto:phamvantuyenuit2006@gmail.com)
* **Kho lưu trữ chính thức:** [https://github.com/phamvantuyenuit2006-oss/VietAI-Life](https://github.com/phamvantuyenuit2006-oss/VietAI-Life)

Toàn bộ ý tưởng thiết kế, mã nguồn và kiến trúc nền tảng **VietAI Life** thuộc quyền sở hữu của **Tuyên Phạm**. Dự án được phân phối dưới giấy phép mã nguồn mở [MIT License](LICENSE).

---

## 📄 Giấy phép bản quyền (License)

```
Copyright (c) 2026 Tuyên Phạm (Pham Van Tuyen - phamvantuyenuit2006-oss)
All rights reserved.
```
Phát hành theo giấy phép [MIT License](LICENSE).
