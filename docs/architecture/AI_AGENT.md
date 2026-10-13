# KIẾN TRÚC AI AGENT ENGINE (AI AGENT ARCHITECTURE)

**Dự án:** VietAI Life — AI Agent Platform  
**Module:** Module 2 — Autonomous Agent Orchestrator & Multi-Step Reasoning  

---

## 1. Chu trình điều phối Agent 11 bước (11-Stage Agent Lifecycle)

Khác với các ứng dụng Chatbot thông thường chỉ đơn giản là chuyển tiếp tin nhắn qua API, **VietAI Life Agent Engine** hoạt động như một cỗ máy suy luận tự trị có kiểm soát:

```
                  ┌─────────────────────────────────────┐
                  │    1. User Request (Input Goal)     │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    2. Intent & Risk Detector        │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    3. Context & Multi-tier Memory   │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    4. Knowledge & RAG Retrieval     │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    5. Multi-Step Planner (DAG)      │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    6. Tool Selection & Permission   │
                  └──────────────────┬──────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
[Cần người dùng phê duyệt?]                             [Tác vụ an toàn]
  • Gửi email / Thanh toán                                • Tìm kiếm / Tính toán
  • Xóa dữ liệu / Đổi mật khẩu                            • Đọc tài liệu / Trích xuất
           │                                                   │
   (Human Confirmation)                                        │
           ▼                                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│              7. Tool Execution (Async Sandbox Runner)                  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│              8. Observation & Evaluation of Tool Output                │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│     9. Verification & Fact-Checking (So sánh với dữ liệu gốc)          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│     10. Safety Guardrails (Lọc nội dung nguy hiểm, gán cảnh báo)       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│     11. Final Structured Response (Kèm Trích dẫn & Kế hoạch tiếp theo) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hệ thống Bộ nhớ đa tầng (Multi-tier Memory System)

Để trợ lý AI thực sự đồng hành dài hạn với người dùng mà vẫn bảo vệ tuyệt đối quyền riêng tư, bộ nhớ được chia thành 4 phân lớp:

| Tầng bộ nhớ | Phạm vi (Scope) | Dữ liệu lưu trữ | Cơ chế lưu & Hủy |
| :--- | :--- | :--- | :--- |
| **Short-term Memory** | Trong phiên hội thoại hiện tại | Lịch sử 10-20 tin nhắn gần nhất, ngữ cảnh trực tiếp | Lưu trong RAM / Redis, tự xóa sau khi hết phiên |
| **Long-term Memory** | Xuyên suốt các phiên hội thoại | Thói quen, bối cảnh công việc, thông tin được cho phép | Lưu trong SQL Server mã hóa, người dùng có quyền xem/sửa/xóa |
| **Task Memory** | Trong suốt quá trình chạy 1 nhiệm vụ | Trạng thái các bước, biến trung gian, kết quả công cụ | Lưu theo `AgentTaskId`, xóa khi nhiệm vụ hoàn thành |
| **Preference Memory** | Cấu hình cá nhân hóa | Giọng điệu (trang trọng/thân mật), cỡ chữ, phương ngữ | Lưu trong bảng `UserPreferences`, người dùng toàn quyền bật/tắt |

---

## 3. Hệ thống Công cụ chuẩn hóa (Tool Registry & Schema)

Mọi công cụ mà Agent có quyền gọi đều phải tuân thủ chuẩn JSON Schema định danh rõ ràng:

```json
{
  "name": "create_learning_schedule",
  "description": "Tạo lộ trình học tập cá nhân hóa và lưu các nhiệm vụ hàng ngày vào lịch của người dùng.",
  "parameters": {
    "type": "object",
    "properties": {
      "goalTitle": { "type": "string", "description": "Tên mục tiêu học tập (ví dụ: Học tiếng Anh B1)" },
      "durationWeeks": { "type": "integer", "description": "Tổng số tuần học" },
      "dailyMinutes": { "type": "integer", "description": "Số phút học mỗi ngày (mặc định 60)" },
      "milestones": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Danh sách các mốc kiểm tra trình độ"
      }
    },
    "required": ["goalTitle", "durationWeeks", "milestones"]
  },
  "permissionLevel": "RequiresUserApproval",
  "category": "Education"
}
```

---

## 4. Cơ chế kiểm soát an toàn & Tự phục hồi lỗi (Guardrails & Resilience)

* **Giới hạn số bước thực thi (Max Steps):** Mặc định tối đa 10 bước cho 1 tác vụ để tránh vòng lặp vô hạn (Infinite Loop).
* **Thời gian giới hạn (Timeout):** Mỗi bước tối đa 30 giây, toàn bộ Task tối đa 3 phút.
* **Cơ chế thử lại (Retry with Self-Correction):** Khi một công cụ trả về lỗi, Agent không dừng lại ngay mà đưa lỗi vào Context để mô hình tự hiệu chỉnh tham số gọi lại tối đa 2 lần.
* **Cơ chế hủy bỏ (Cancellation Token):** Người dùng có thể nhấn nút "Dừng tác vụ" bất kỳ lúc nào để ngắt ngay lập tức mọi tiến trình đang chạy ngầm.
