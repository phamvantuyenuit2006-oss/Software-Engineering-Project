# PRODUCT REQUIREMENT DOCUMENT (PRD) — VIETAI LIFE

**Tên sản phẩm:** VietAI Life — AI Agent Platform for Vietnamese People  
**Tên tiếng Việt:** VietAI Life — Trợ lý AI Thông Minh Cho Người Việt  
**Tagline:** *AI hiểu người Việt, đồng hành cùng cuộc sống.*  
**Trạng thái tài liệu:** Đã duyệt (Approved for Phase 0)  
**Tác giả:** Đội ngũ Product Management & Research

---

## 1. Tầm nhìn & Sứ mệnh (Vision & Mission)

### 1.1. Tầm nhìn (Vision)
Xây dựng một nền tảng **AI Agent thông minh toàn diện dành riêng cho người Việt**, thấu hiểu sâu sắc ngôn ngữ, văn hóa, thói quen và bối cảnh kinh tế - xã hội tại Việt Nam.

VietAI Life **không chỉ là một Chatbot thông thường (Prompt $\rightarrow$ Output)**, mà là một **Hệ điều hành Agent (Action-driven AI Platform)** có khả năng:
* Hiểu tiếng Việt tự nhiên và bối cảnh văn hóa Việt.
* Tự động lập kế hoạch và thực hiện chuỗi tác vụ phức tạp (Multi-step Planning & Execution).
* Tích hợp kho tri thức đáng tin cậy với hệ thống trích dẫn nguồn minh bạch (Trust Layer).
* Sử dụng công cụ (Tool calling) và hỗ trợ kiểm chứng con người (Human-in-the-loop).

### 1.2. Sự khác biệt cốt lõi (Core Differentiators)
> **"Không cạnh tranh bằng việc AI trả lời hay hơn, mà tập trung vào: AI hiểu ngữ cảnh Việt Nam + Agent tự chủ + Tri thức minh bạch + Hành động thực tế."**

---

## 2. Chân dung người dùng mục tiêu (User Personas)

1. **Sinh viên & Học sinh:**
   * Nhu cầu: Học tập cá nhân hóa, giải thích bài tập, ôn luyện chứng chỉ (IELTS/TOEIC/B1), nghiên cứu tài liệu, xây dựng lộ trình sự nghiệp, viết CV và chuẩn bị phỏng vấn.
2. **Người đi làm & Nhân sự tri thức:**
   * Nhu cầu: Tóm tắt và phân tích tài liệu (PDF, Word, Excel), viết email chuyên nghiệp, quản lý thời gian, nâng cao kỹ năng mềm, lập kế hoạch dự án.
3. **Chủ doanh nghiệp nhỏ & Hộ kinh doanh (SME):**
   * Nhu cầu: Phân tích thị trường, lập kế hoạch kinh doanh, sáng tạo nội dung marketing, quản lý chăm sóc khách hàng, phân tích doanh thu cơ bản.
4. **Bà con nông dân:**
   * Nhu cầu: Tra cứu kỹ thuật nông nghiệp, nhận diện sâu bệnh qua ảnh chụp cây trồng, xem lịch thời tiết và khuyến cáo mùa vụ theo địa phương.
5. **Người cao tuổi & Người yếu thế:**
   * Nhu cầu: Giao diện cực kỳ trực quan, chữ lớn, hỗ trợ 100% bằng giọng nói tiếng Việt, giải đáp thắc mắc dịch vụ công và y tế cơ bản.
6. **Người khiếm thị / Khuyết tật:**
   * Nhu cầu: Trải nghiệm trợ năng toàn diện (Accessibility), chuyển đổi giọng nói thành văn bản (STT), đọc văn bản thành giọng nói (TTS), điều hướng bàn phím tối ưu.

---

## 3. Bản đồ các Module chức năng (Functional Modules)

```
                       ┌───────────────────────────────┐
                       │       VIETAI LIFE PLATFORM    │
                       └──────────────┬────────────────┘
                                      │
  ┌───────────────┬───────────────────┼───────────────────┬───────────────┐
  ▼               ▼                   ▼                   ▼               ▼
[AI Assistant] [AI Agent Engine] [RAG & Knowledge]   [Vision & Voice] [Verticals]
 - Q&A           - Intent Detection   - Trust Layer        - OCR            - Education
 - Chatbot       - Memory 4-layers    - Doc Chunking       - Visual Q&A     - Career
 - Summarizer    - Multi-step Plan    - Hybrid Vector      - STT / TTS      - Business
 - Translator    - Tool Execution     - Source Citations   - Voice Agent    - Agriculture
```

### Module 1: AI Assistant
* Xử lý hội thoại tự nhiên, dịch thuật ngữ cảnh Việt, tóm tắt nội dung dài, soạn thảo văn bản.

### Module 2: AI Agent Engine (Module trọng tâm)
* Chu trình xử lý 10 bước: `User Request` $\rightarrow$ `Intent Detection` $\rightarrow$ `Context Analysis` $\rightarrow$ `Memory Retrieval` $\rightarrow$ `Knowledge Retrieval` $\rightarrow$ `Task Planning` $\rightarrow$ `Tool Selection` $\rightarrow$ `Tool Execution` $\rightarrow$ `Observation` $\rightarrow$ `Verification & Safety Check` $\rightarrow$ `Response`.
* Hỗ trợ tự phục hồi lỗi (Error recovery), cơ chế thử lại (Retry) và hủy bỏ an toàn (Cancellation).

### Module 3 & 4: VietAI Knowledge Base & RAG Pipeline
* Cơ chế phân biệt 4 mức nhận định: **FACT** (Sự thật), **INFERENCE** (Suy luận), **OPINION** (Quan điểm), **UNCERTAINTY** (Chưa chắc chắn).
* Mọi câu trả lời có dữ liệu thực tế đều phải trích dẫn nguồn tin cậy (Source, URL, Updated Date). Không bao giờ được bịa đặt URL/nguồn giả mạo.

### Module 5 & 6: AI Document & AI Vision
* Hỗ trợ tải lên và xử lý: PDF, DOCX, TXT, CSV, XLSX, Hình ảnh.
* Đọc hiểu báo cáo tài chính, bảng dữ liệu, trích xuất cấu trúc và phân tích ảnh nông nghiệp/học tập.

### Module 7: AI Voice
* Tích hợp Speech-to-Text và Text-to-Speech hỗ trợ ngữ điệu tiếng Việt 3 miền (Bắc - Trung - Nam).

### Module 8, 9, 10, 11: Ứng dụng chuyên ngành
* **Education:** AI Tutor, tạo bộ đề trắc nghiệm (Quiz), Flashcards thông minh, lập kế hoạch học tập cá nhân.
* **Career:** Phân tích khoảng cách kỹ năng (Skill Gap), thiết kế lộ trình chuyển nghề, xuất bản CV chuyên nghiệp, mô phỏng phỏng vấn thử (Mock Interview).
* **Business & Agriculture:** Hỗ trợ hộ kinh doanh nhỏ và nông dân với tri thức bản địa chuẩn xác.

---

## 4. Phạm vi phiên bản MVP (VietAI Life v0.1 Scope)

Để đảm bảo nguyên tắc *"Small $\rightarrow$ Tested $\rightarrow$ Stable $\rightarrow$ Documented $\rightarrow$ Expanded"*, phạm vi MVP bao gồm:

1. **Authentication & Profile:** Đăng ký/Đăng nhập email, JWT Auth, bảo mật mật khẩu PBKDF2/BCrypt.
2. **AI Chat & Streaming:** Giao diện hội thoại phản hồi thời gian thực (Server-Sent Events / WebSocket).
3. **Conversation & Multi-tier Memory:** Quản lý lịch sử hội thoại, bộ nhớ ngắn hạn và tùy chọn ghi nhớ cá nhân.
4. **Document Upload & RAG:** Tải lên file PDF/DOCX, trích xuất nội dung, chunking, vector search và trích dẫn nguồn.
5. **Basic AI Agent Orchestrator:** Lập kế hoạch 3–5 bước, tích hợp các công cụ tìm kiếm tri thức, tính toán, và tạo lịch học/công việc.
6. **Admin Dashboard:** Theo dõi số lượng người dùng, DAU/MAU, thống kê lượng Token sử dụng và ước tính chi phí AI.
