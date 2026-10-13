# USE CASES SPECIFICATION — VIETAI LIFE

Tài liệu này mô tả chi tiết các Use Case trọng tâm, luồng hoạt động chính (Main Flow), luồng ngoại lệ (Alternative / Exception Flow) và các điểm kiểm soát an toàn.

---

## USE CASE 1: HỎI ĐÁP TRI THỨC CÓ TRÍCH DẪN NGUỒN (RAG WITH TRUST LAYER)

* **Tác nhân:** Người dùng (End User).
* **Mục tiêu:** Nhận được câu trả lời chính xác, trung thực, kèm nguồn tham chiếu minh bạch.
* **Tiền điều kiện:** Người dùng đã đăng nhập và đặt câu hỏi qua thanh Chat.

### Luồng xử lý chính (Main Flow):
```
[User Message] 
       ↓ 
1. Intent & Safety Classification (Phát hiện ý định & Kiểm tra an toàn)
       ↓
2. Hybrid Retrieval (Truy xuất kết hợp: Semantic Vector + Full-text Keyword)
       ↓
3. Context Re-ranking & Filtering (Tái xếp hạng văn bản theo mức độ liên quan)
       ↓
4. Prompt Augmentation (Ghép văn cảnh và quy tắc Fact/Inference vào System Prompt)
       ↓
5. LLM Streaming Generation (Sinh câu trả lời từng từ theo thời gian thực)
       ↓
6. Fact Verification & Citation Linking (Gắn thẻ nguồn: Title, URL, Ngày cập nhật)
       ↓
[Phản hồi hoàn chỉnh trên UI]
```

### Luồng ngoại lệ (Exception Flows):
* **Trường hợp không tìm thấy dữ liệu trong Kho tri thức:** AI phản hồi thẳng thắn: *"Tôi chưa có đủ dữ liệu từ nguồn tin cậy để xác nhận thông tin này."* Tuyệt đối không bịa đặt nguồn hoặc bịa số liệu.
* **Trường hợp câu hỏi thuộc chủ đề nhạy cảm (Y tế, Pháp luật):** AI đưa ra khuyến nghị chuyên môn kèm thông điệp cảnh báo giới hạn trách nhiệm.

---

## USE CASE 2: XỬ LÝ VÀ PHÂN TÍCH TÀI LIỆU NÂNG CAO (AI DOCUMENT PIPELINE)

* **Tác nhân:** Sinh viên, Nhân viên văn phòng, Nhà nghiên cứu.
* **Mục tiêu:** Tải lên tài liệu PDF/DOCX dung lượng lớn (lên tới 100 trang), tự động bóc tách, lập chỉ mục và tóm tắt đa chiều (Summary, Key Takeaways, Mind Map, Quiz).

### Luồng xử lý:
1. **Giai đoạn 1 — Ingestion & Processing (Nền tảng):**
   * Người dùng tải file lên $\rightarrow$ Backend kiểm tra MIME Type, Magic Bytes, kích thước file.
   * Lưu trữ file an toàn tại Object Storage / Storage Layer riêng.
   * Background Worker bóc tách văn bản (Text Extraction) $\rightarrow$ Làm sạch (Cleaning) $\rightarrow$ Phân đoạn thông minh (Chunking 500-1000 tokens kèm overlap 100 tokens).
   * Tạo Vector Embedding qua `IAIProvider` và lưu vào Vector Database.
2. **Giai đoạn 2 — Analysis & Interactive Q&A:**
   * Hệ thống tự động tạo: Tóm tắt tổng quan $\rightarrow$ Trích xuất 10 điểm cốt lõi $\rightarrow$ Bộ câu hỏi trắc nghiệm tự kiểm tra kiến thức (Interactive Quiz).
   * Người dùng chat trực tiếp trên tài liệu: Mọi câu trả lời đều trích dẫn chính xác số trang (Page Index) và trích dẫn đoạn văn bản gốc.

---

## USE CASE 3: LẬP KẾ HOẠCH HÀNH ĐỘNG TỰ ĐỘNG ĐA BƯỚC (AI AGENT WORKFLOW)

* **Tác nhân:** Người học, Người đi làm.
* **Mục tiêu:** Chuyển đổi một mục tiêu phức tạp (ví dụ: *"Tôi muốn học tiếng Anh B1 trong 3 tháng"*) thành một kế hoạch hành động thực tế có thể theo dõi.

### Luồng điều phối của AI Agent (Agent Orchestrator):
```
[User Request: "Học B1 trong 3 tháng"]
       ↓
1. IntentDetector: Nhận diện đây là tác vụ Lập kế hoạch (Planning Task)
       ↓
2. Context & Memory: Kiểm tra trình độ hiện tại từ User Profile / Previous Conversations
       ↓
3. Agent Planner: Sinh cấu trúc kế hoạch 12 tuần (Phân bổ Từ vựng, Ngữ pháp, Nghe, Đọc, Viết)
       ↓
4. Tool Selection: Gọi công cụ `create_study_plan` và `generate_flashcards`
       ↓
5. Tool Execution: Tạo bản ghi Lộ trình (Roadmap) và các Nhiệm vụ con (Tasks) vào Cơ sở dữ liệu
       ↓
6. Observation & Verifier: Kiểm tra xem lịch học có bị quá tải không (mỗi ngày tối đa 60-90 phút)
       ↓
7. Response Generator: Trả về giao diện Lộ trình tương tác (Interactive Timeline) kèm nút kích hoạt thông báo học tập
```

---

## USE CASE 4: CƠ CHẾ XÁC NHẬN TỪ CON NGƯỜI (HUMAN-IN-THE-LOOP)

* **Tác nhân:** AI Agent và Người dùng.
* **Mục tiêu:** Ngăn chặn các hành động tự động có hậu quả lớn (Gửi email quan trọng, Xóa dữ liệu, Thanh toán, Thay đổi thiết lập tài khoản).

### Quy tắc kiểm soát (Guardrails):
1. Khi Agent quyết định thực hiện một hành động có ảnh hưởng ngoài hệ thống (ví dụ: Soạn thảo email gửi đối tác hoặc đăng ký khóa học):
2. Agent **KHÔNG ĐƯỢC TỰ ĐỘNG THỰC HIỆN NGAY**.
3. Agent hiển thị bản xem trước (Preview Modal) với 2 nút hành động rõ ràng:
   * **[Xác nhận thực hiện]** $\rightarrow$ Agent tiếp tục quy trình.
   * **[Hủy bỏ / Chỉnh sửa]** $\rightarrow$ Agent dừng hành động hoặc điều chỉnh theo ý người dùng.
4. Mọi lệnh gọi công cụ (Tool Call) đều được ghi nhật ký (Audit Log) với đầy đủ `UserId`, `Timestamp`, `ToolName`, `InputParameters`, `ResultStatus`.
