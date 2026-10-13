# VIETAI LIFE — BẢN THIẾT KẾ & QUY HOẠCH CHIẾN LƯỢC TOÀN DIỆN
> **"AI thấu hiểu người Việt — Đồng hành cùng nhịp sống mỗi ngày"**  
> *Được chuẩn hóa từ Ý tưởng & Định hướng phát triển của VietAI Life.*

---

## I. TỔNG QUAN ĐỊNH VỊ & SỰ KHÁC BIỆT CỐT LÕI

### 1. Vấn đề thực tế của thị trường
Hiện nay, các mô hình ngôn ngữ lớn toàn cầu (ChatGPT, Claude, Gemini) rất xuất sắc ở khả năng suy luận tổng quát và kiến thức học thuật phương Tây. Tuy nhiên, khi ứng dụng vào **đời sống thường nhật của 100 triệu người dân Việt Nam**, người dùng đại chúng liên tục vấp phải những rào cản lớn:
* **Thiếu ngữ cảnh văn hóa & địa phương:** Không hiểu mâm cơm gia đình truyền thống, giá cả mớ rau con cá ngoài chợ dân sinh, phong tục giỗ chạp, ngày rằm mùng một theo Âm lịch.
* **Không nắm rõ thể chế hành chính - xã hội Việt Nam:** Quy trình làm Căn cước công dân gắn chip, đăng ký tạm trú qua app VNeID, cách tính thuế TNCN giảm trừ gia cảnh, quyền lợi chuyển tuyến Bảo hiểm y tế (BHYT) thường bị trả lời chung chung hoặc dịch máy từ luật nước ngoài.
* **Rào cản tiếp cận công nghệ:** Người lớn tuổi, lao động tự do, tiểu thương và sinh viên cần sự tiện lợi nhanh chóng (nói một câu tiếng Việt là ghi sổ chi tiêu, chụp ảnh tô phở là biết calo), thay vì phải gõ những câu Prompt tiếng Anh phức tạp.

### 2. Định vị sản phẩm (Value Proposition)
**VietAI Life** được định vị là **"Người bạn AI đồng hành trong đời sống hằng ngày" (Domestic Life AI Companion)**, tập trung giải quyết các việc nhỏ nhưng lặp lại liên tục:
```
                      ┌─────────────────────────────────┐
                      │          VIETAI LIFE            │
                      │  Trợ lý Đời sống Người Việt     │
                      └────────────────┬────────────────┘
                                       │
     ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
     ▼                  ▼              ▼              ▼                  ▼
[SỨC KHỎE &         [TÀI CHÍNH         [GIA ĐÌNH, CHỢ &  [HÀNH CHÍNH &    [HỌC TẬP &
 DINH DƯỠNG VIỆT]    CÁ NHÂN]          LỊCH ÂM DƯƠNG]    TIỆN ÍCH CÔNG]   GIA SƯ AI]
  - Calo món Việt     - Ghi chép voice   - Mâm cơm ngân     - VNeID / CCCD   - Gia sư B1/VSTEP
  - Nhắc uống thuốc   - Phân tích ví     sách chợ          - Tạm trú         - Tạo Flashcard
  - Cảnh báo y tế     - Thuế & BHXH      - Lịch giỗ & rằm  - Soạn văn bản   - Lộ trình mục tiêu
```

---

## II. 5 TRỤ CỘT TÍNH NĂNG ĐỜI SỐNG (CORE LIFE PILLARS)

### 1. Sức khỏe & Thói quen (Viet Health & Wellness)
* **Nhật ký dinh dưỡng món Việt:**
  * Cơ sở dữ liệu hơn 500 món ăn truyền thống 3 miền (Phở bò, cơm tấm sườn bì chả, bún chả, bánh mì pa-tê, hủ tiếu Nam Vang, canh chua cá lóc...).
  * Nhận diện và ước lượng năng lượng (Calo, Protein, Carbs, Fat, Sodium) kèm gợi ý thời gian vận động tương ứng (đi bộ bao nhiêu phút, chạy bộ bao nhiêu km).
* **Quản lý lịch uống thuốc & Thói quen:**
  * Lên lịch nhắc uống thuốc theo cữ (sáng/trưa/chiều/tối, trước/sau ăn).
  * Nhắc uống nước theo cân nặng và thời tiết địa phương.
* **Tư vấn sức khỏe có rào chắn an toàn (Medical Guardrails):**
  * Tự động nhận diện triệu chứng bệnh và luôn hiển thị khuyến cáo bắt buộc: *"Thông tin chỉ mang tính tham khảo. Hãy đến cơ sở y tế gần nhất nếu triệu chứng kéo dài hoặc khẩn cấp."*

### 2. Tài chính cá nhân thông minh (Viet Personal Finance)
* **Ghi chép chi tiêu bằng giọng nói tự nhiên (Voice-to-Expense):**
  * Người dùng chỉ cần nói: *"Trưa nay ăn bún bò 45 nghìn"*, *"Đổ xăng xe máy 70k"*, *"Mua hộp sữa cho con 320 nghìn"*.
  * AI Entity Extraction tự động bóc tách: `{ Amount: 45000, Category: "Ăn uống", Note: "Bún bò", Time: "Hôm nay trưa" }`.
* **Phân loại ví chi tiêu & Cảnh báo bội chi:**
  * Áp dụng quy tắc 6 chiếc lọ hoặc 50/30/20 phù hợp mức thu nhập tại Việt Nam.
  * Cảnh báo trực quan khi chi tiêu vượt quá 80% ngân sách tháng.
* **Cẩm nang giải thích tài chính & Pháp lý thuế:**
  * Giải thích trực quan cách tính Thuế thu nhập cá nhân (TNCN) mới nhất, mức giảm trừ gia cảnh, đóng BHXH bắt buộc và quyền lợi BHYT.

### 3. Gia đình, Chợ & Lịch Âm Dương (Family & Vietnamese Culture)
* **Đi chợ theo ngân sách (Smart Market Planner):**
  * Người dùng nhập: *"Hôm nay có 100k, nhà 4 người ăn tối thì nấu gì?"*
  * AI lên thực đơn 3 món chuẩn bữa cơm Việt (1 món mặn, 1 món canh, 1 món rau luộc/xào) kèm định lượng giá cả chi tiết tại chợ truyền thống.
* **Lịch Vạn Niên & Phong tục Việt Nam:**
  * Tra cứu Âm - Dương, ngày tốt/xấu, giờ Hoàng đạo.
  * Nhắc nhở tự động ngày Rằm (15), Mùng Một (01) Âm lịch, các ngày Giỗ gia tiên, Tết Đoan Ngọ, Tết Trung Thu, Tết Nguyên Đán.
* **Lịch gia đình đồng bộ:**
  * Chia sẻ việc nhà, đưa đón con nhỏ, sinh nhật người thân.

### 4. Công việc & Thủ tục Hành chính Việt Nam (Civic & Daily Assistant)
* **Cẩm nang dịch vụ công từng bước (Civic Services Hub):**
  * Đăng ký tạm trú / thường trú trực tuyến qua Cổng Dịch vụ công hoặc VNeID.
  * Hướng dẫn cấp mới, đổi Căn cước công dân gắn chip.
  * Hướng dẫn cấp đổi Giấy phép lái xe trực tuyến.
  * Thủ tục nhận BHXH một lần và trợ cấp thất nghiệp.
* **Soạn thảo đơn từ & Văn bản chuẩn mực:**
  * Đơn xin nghỉ phép, hợp đồng thuê nhà trọ, giấy ủy quyền, đơn khiếu nại, email giao việc chuyên nghiệp.

### 5. Học tập & Phát triển bản thân (Viet Tutor & Career)
* **Gia sư AI cá nhân hóa:**
  * Luyện thi chứng chỉ tiếng Anh (VSTEP B1/B2, TOEIC, IELTS).
  * Luyện giải bài tập Toán, Lý, Hóa bám sát chương trình Giáo dục phổ thông mới của Bộ GD&ĐT.
* **Tự động hóa học tập:**
  * Tóm tắt bài giảng PDF, sinh bộ thẻ ghi nhớ (Flashcard) và tạo đề trắc nghiệm kiểm tra nhanh.

---

## III. LỘ TRÌNH TRIỂN KHAI & HIỆN THỰC HÓA (ROADMAP)

```
[GIAI ĐOẠN 1: MVP - 1-2 THÁNG] (ĐANG HOÀN THIỆN)
├── Web Hub & Mobile Mockup hoàn chỉnh
├── Chatbot tiếng Việt với Trust Layer (xác thực nguồn)
├── Sổ tay Chi tiêu thông minh (Voice/Text parsing)
├── Dinh dưỡng món Việt & Ước tính calo
└── Lịch Âm Dương & Gợi ý mâm cơm đi chợ
        ↓
[GIAI ĐOẠN 2: MỞ RỘNG - 3-6 THÁNG]
├── Tích hợp STT/TTS giọng Việt 3 miền chất lượng cao
├── Tích hợp Vision AI chụp ảnh nhận diện món ăn thực tế
├── Zalo Mini App (tiếp cận tệp người dùng đại chúng)
└── Đồng bộ lịch gia đình qua Push Notification
        ↓
[GIAI ĐOẠN 3: TĂNG TRƯỞNG & ĐỐI TÁC - 6-12 THÁNG]
├── Liên kết Open Banking / VietQR thanh toán & đối soát tự động
├── Kết nối dữ liệu giá chợ & chuỗi siêu thị bán lẻ (WinMart, Co.opmart)
└── Gói thành viên Pro (không giới hạn lượt AI, báo cáo gia đình)
        ↓
[GIAI ĐOẠN 4: DOANH THU BỀN VỮNG - 12+ THÁNG]
├── B2B/B2B2C cho trường học, tổ chức y tế và doanh nghiệp SME
└── Hợp tác thương hiệu minh bạch (Ngân hàng, Chuỗi y tế, Bảo hiểm)
```

---

## IV. NGUYÊN TẮC BẢO MẬT & ĐẠO ĐỨC AI
1. **Tuân thủ Nghị định 13/2023/NĐ-CP:** Dữ liệu cá nhân, âm thanh giọng nói và tài chính của người dùng phải được mã hóa đầu cuối và không bao giờ đem huấn luyện LLM khi chưa được đồng thuận rõ ràng.
2. **Nguyên tắc "Human-in-the-loop":** Các quyết định quan trọng (chuyển tiền, gửi văn bản pháp lý, kê đơn) bắt buộc phải do người dùng tự duyệt và kiểm chứng.
3. **Cảnh báo trách nhiệm rõ ràng:** Mọi phản hồi liên quan đến Y tế, Dược phẩm và Tài chính đều bắt buộc đi kèm ghi chú nguồn gốc và khuyến nghị tham vấn chuyên gia.
