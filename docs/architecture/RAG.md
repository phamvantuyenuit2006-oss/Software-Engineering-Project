# KIẾN TRÚC RAG & TRUST LAYER (RETRIEVAL-AUGMENTED GENERATION)

**Dự án:** VietAI Life Platform  
**Module:** Module 3 & 4 — VietAI Knowledge Base, RAG Pipeline & Trust Verification  

---

## 1. Quy trình xử lý dữ liệu RAG Pipeline 11 bước

Để giải quyết triệt để bài toán "Ảo giác AI" (Hallucination) và đảm bảo thông tin chuẩn xác cho người dùng Việt Nam, RAG Pipeline được triển khai qua 11 bước nghiêm ngặt:

```
[TÀI LIỆU ĐẦU VÀO] (PDF, DOCX, TXT, CSV, Web Page)
        │
        ▼
1. Text & Table Extraction (Bóc tách văn bản, công thức, bảng biểu)
        │
        ▼
2. Text Cleaning & Normalization (Làm sạch ký tự rác, chuẩn hóa tiếng Việt)
        │
        ▼
3. Semantic Chunking (Cắt đoạn thông minh 512–1024 tokens + 100 token overlap)
        │
        ▼
4. Metadata Enrichment (Gắn Title, Source, Category, PageNumber, TrustLevel)
        │
        ▼
5. Dense Vector Embedding (Chuyển đổi thành Vector qua IAIProvider)
        │
        ▼
6. Vector Database Indexing (Lưu trữ và lập chỉ mục HNSW)
        │
        ▼
[TRUY VẤN NGƯỜI DÙNG]
        │
        ├──────────────────────────────┬──────────────────────────────┐
        ▼                              ▼                              ▼
7. Dense Semantic Search       Sparse Keyword Search      Metadata Filtering
 (Tìm theo ngữ nghĩa Vector)    (Tìm theo từ khóa BM25)   (Lọc theo ngày/danh mục)
        │                              │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       ▼
8. Hybrid Fusion Score (Tổng hợp điểm số bằng Reciprocal Rank Fusion - RRF)
        │
        ▼
9. Cross-Encoder Reranking (Tái chấm điểm độ liên quan ngữ cảnh với Reranker)
        │
        ▼
10. Dynamic Context Assembly (Đưa các đoạn trích điểm cao nhất vào Prompt)
        │
        ▼
11. LLM Generation with Trust Badges (Sinh câu trả lời kèm thẻ nguồn minh bạch)
```

---

## 2. Tầng xác thực niềm tin (Trust Layer & Epistemic Classification)

VietAI Life thiết lập một cơ chế phân loại 4 mức độ nhận thức (Epistemic States) để người dùng luôn biết rõ bản chất của từng câu trả lời:

| Mức độ | Định nghĩa | Cách hiển thị trên giao diện |
| :--- | :--- | :--- |
| **FACT (Sự thật)** | Dữ liệu thực tế, số liệu lịch sử, văn bản pháp luật, tài liệu chính thống có nguồn gốc kiểm chứng | Đính kèm **Huy hiệu Nguồn (Citation Badge)**: [Tên nguồn, URL, Ngày cập nhật] |
| **INFERENCE (Suy luận)** | Kết luận logic được rút ra từ các dữ liệu thực tế | Đính kèm nhãn *"Suy luận từ dữ liệu phân tích"* |
| **OPINION (Quan điểm)** | Đánh giá chủ quan, lời khuyên phong cách, gợi ý sáng tạo | Đính kèm nhãn *"Ý kiến / Đề xuất tham khảo"* |
| **UNCERTAINTY (Không chắc chắn)** | Thiếu dữ liệu, thông tin mâu thuẫn, chưa đủ cơ sở khẳng định | Phản hồi rõ ràng: *"Tôi chưa có đủ dữ liệu đáng tin cậy để xác nhận thông tin này."* |

---

## 3. Quy tắc "Bất khả xâm phạm" của Trust Layer

1. **Tuyệt đối không bịa đặt nguồn (Zero Hallucinated Citations):** Không bao giờ tự sinh ra URL hoặc tên tổ chức không có thật trong hệ thống.
2. **Trích dẫn chính xác cấp đoạn văn (Snippet-level Citations):** Khi người dùng bấm vào một thẻ nguồn trên giao diện, hệ thống mở cửa sổ xem trước tài liệu và tô sáng (highlight) đúng đoạn văn bản gốc đã được AI sử dụng.
3. **Cảnh báo an toàn lĩnh vực nhạy cảm:** Khi trả lời các câu hỏi về sức khỏe, y tế, tài chính đầu tư, pháp lý, hệ thống luôn chèn khối cảnh báo: *"Thông tin chỉ mang tính chất tham khảo, vui lòng tham khảo ý kiến chuyên gia có chứng chỉ trước khi đưa ra quyết định."*
