# USER STORIES — VIETAI LIFE

Tài liệu này định nghĩa các User Story chuẩn theo cấu trúc `As a... I want... So that...` cùng tiêu chí chấp thuận (Acceptance Criteria - AC) chi tiết cho từng nhóm đối tượng người dùng.

---

## 1. Nhóm Sinh viên & Người học tập (Education & Career)

### US-01: Lập kế hoạch học tập cá nhân hóa đa bước
* **As a:** Sinh viên đại học năm 3,
* **I want:** Nhập mục tiêu "Đạt chứng chỉ B1 tiếng Anh trong 3 tháng",
* **So that:** AI tự động phân tích trình độ, chia nhỏ nhiệm vụ thành lịch học 12 tuần và tạo các bộ Flashcard ôn tập hàng ngày.
* **Acceptance Criteria (AC):**
  1. AI không chỉ đưa ra câu trả lời chung chung mà phải kích hoạt **Agent Planning**.
  2. Hệ thống sinh ra lộ trình tuần $\rightarrow$ ngày kèm bài tập cụ thể.
  3. Cho phép người dùng xuất lịch học vào Google Calendar / Lịch hệ thống.
  4. Hỗ trợ cơ chế theo dõi tiến độ hoàn thành (Task Progress).

### US-02: Phân tích khoảng cách kỹ năng (Skill Gap Analysis) & Tạo CV
* **As a:** Sinh viên mới tốt nghiệp muốn trở thành Full-Stack Web Developer,
* **I want:** Cung cấp danh sách kỹ năng hiện có và vị trí mong muốn,
* **So that:** AI chỉ ra những kỹ năng còn thiếu, đề xuất 3 dự án thực chiến để làm đẹp Portfolio và hỗ trợ viết CV chuẩn ATS.
* **Acceptance Criteria (AC):**
  1. Báo cáo Skill Gap chỉ rõ mức độ khớp (Match Rate %) giữa hồ sơ và tiêu chuẩn ngành.
  2. Gợi ý tài liệu học tập có đính kèm nguồn trích dẫn uy tín.
  3. Xuất file CV định dạng PDF / DOCX chuyên nghiệp.

---

## 2. Nhóm Người đi làm & Tri thức (Productivity & Document AI)

### US-03: Tóm tắt và hỏi đáp trên tài liệu PDF 100 trang
* **As a:** Chuyên viên phân tích nghiệp vụ,
* **I want:** Tải lên một bản báo cáo dài 100 trang (PDF/DOCX) và đặt câu hỏi chuyên sâu,
* **So that:** Hệ thống trích xuất thông tin chính xác, tóm tắt ý chính và dẫn chiếu chính xác trang chứa thông tin.
* **Acceptance Criteria (AC):**
  1. Hỗ trợ upload tài liệu an toàn (kiểm tra MIME type, dung lượng < 25MB).
  2. Tốc độ xử lý Chunking & Vector Indexing dưới 10 giây cho tài liệu thông thường.
  3. Câu trả lời của AI phải đính kèm **Citation Badge** (Trang số, Đoạn văn bản gốc).
  4. Nếu thông tin không có trong tài liệu, AI phải nói rõ "Tài liệu không đề cập đến thông tin này".

### US-04: Soạn thảo email công việc và chuẩn hóa văn phong
* **As a:** Nhân viên văn phòng,
* **I want:** Cung cấp các ý chính bằng tiếng Việt ngắn gọn,
* **So that:** AI tự động tạo bản nháp email lịch sự, chuẩn văn phong doanh nghiệp Việt Nam.

---

## 3. Nhóm Doanh nghiệp nhỏ & Hộ kinh doanh (SME & Business)

### US-05: Lập kế hoạch kinh doanh & Chiến lược Marketing cơ bản
* **As a:** Chủ quán cà phê sắp khai trương,
* **I want:** Nhập mô hình và ngân sách khởi điểm,
* **So that:** AI đề xuất cấu trúc chi phí, bảng giá thực đơn mẫu, kế hoạch khuyến mãi khai trương và kịch bản chăm sóc khách hàng.
* **Acceptance Criteria (AC):**
  1. Bảng tính chi phí rõ ràng theo đơn vị VNĐ.
  2. Gợi ý 5 ý tưởng nội dung đăng bài mạng xã hội phù hợp văn hóa địa phương.

---

## 4. Nhóm Nông dân & Nông nghiệp số (Agriculture)

### US-06: Chẩn đoán sâu bệnh cây trồng qua hình ảnh
* **As a:** Người nông dân trồng lúa / sầu riêng,
* **I want:** Chụp và tải ảnh lá cây có dấu hiệu bị vàng / sâu bệnh,
* **So that:** AI nhận diện loại sâu bệnh tiềm năng, hướng dẫn cách khắc phục và khuyến nghị thời điểm phun thuốc an toàn.
* **Acceptance Criteria (AC):**
  1. Nhận diện ảnh qua Vision API với độ chính xác cao.
  2. Hiển thị cảnh báo: *"Đây là khuyến nghị tham khảo từ AI, bà con nên tham vấn cán bộ khuyến nông địa phương trước khi xử lý hóa chất."*
  3. Trích dẫn rõ nguồn gốc kỹ thuật nông nghiệp từ Viện/Trường uy tín.

---

## 5. Nhóm Người cao tuổi & Người khuyết tật (Accessibility & Voice)

### US-07: Tương tác 100% bằng giọng nói tiếng Việt
* **As a:** Người lớn tuổi mắt kém hoặc người khiếm thị,
* **I want:** Nhấn một nút lớn và nói chuyện trực tiếp bằng tiếng Việt,
* **So that:** Hệ thống nhận diện giọng nói chính xác và đọc to câu trả lời với giọng đọc tự nhiên, dễ nghe.
* **Acceptance Criteria (AC):**
  1. Giao diện có chế độ tương phản cao (High Contrast) và phóng to cỡ chữ (Font Scaling).
  2. Hỗ trợ phím tắt điều hướng bàn phím cho Screen Reader.
  3. Nhận diện tốt giọng nói có độ trễ < 1.5 giây.

---

## 6. Nhóm Quản trị viên hệ thống (Admin & Operations)

### US-08: Giám sát chi phí AI và lượng Token tiêu thụ
* **As a:** Quản trị viên hệ thống (SuperAdmin),
* **I want:** Xem biểu đồ chi phí AI, số lượng Request và lượng Token tiêu thụ theo từng ngày/từng User/từng Model,
* **So that:** Tôi kiểm soát được ngân sách vận hành và phát hiện sớm các hành vi lạm dụng (Abuse).
* **Acceptance Criteria (AC):**
  1. Dashboard hiển thị trực quan DAU, MAU, Tổng Token, Chi phí ước tính (USD/VNĐ).
  2. Thiết lập được hạn mức Token Quota cho từng tài khoản người dùng.
