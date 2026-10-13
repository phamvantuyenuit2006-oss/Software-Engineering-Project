# BÁO CÁO ĐỒ ÁN CÔNG NGHỆ PHẦN MỀM
## ĐỀ TÀI: HỆ THỐNG THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ
### (AUTOMATED MULTILINGUAL NARRATION SYSTEM)

---

- **Môn học**: Công nghệ phần mềm (Software Engineering)
- **Giảng viên hướng dẫn**: ThS. Nguyễn Quốc Huy
- **Sinh viên thực hiện / Tác giả**: Tuyên Phạm (`@phamvantuyenuit2006-oss`)
- **Email tác giả**: `phamvantuyenuit2006@gmail.com`
- **Mã nguồn GitHub**: [https://github.com/phamvantuyenuit2006-oss/VietAI-Life](https://github.com/phamvantuyenuit2006-oss/VietAI-Life)
- **Bản quyền**: &copy; 2026 Tuyên Phạm. Toàn quyền tác giả và sở hữu trí tuệ đồ án.

---

## MỤC LỤC
1. [CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & BỐI CẢNH THỰC TIỄN](#chương-1-tổng-quan-đề-tài--bối-cảnh-thực-tiễn)
2. [CHƯƠNG 2: ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS & USE CASES)](#chương-2-đặc-tả-yêu-cầu-phần-mềm-srs--use-cases)
3. [CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC HỆ THỐNG & 3 YÊU CẦU CỦA ĐỒ ÁN](#chương-3-thiết-kế-kiến-trúc-hệ-thống--3-yêu-cầu-của-đồ-án)
   - [3.1. Yêu cầu 1: FE DEV (React.js Web & React Native Mobile) + CI/CD](#31-yêu-cầu-1-fe-dev-reactjs-web--react-native-mobile--cicd)
   - [3.2. Yêu cầu 2: BE DEV theo hướng 3 lớp (3-Tier Architecture .NET 10) + CI/CD](#32-yêu-cầu-2-be-dev-theo-hướng-3-lớp-3-tier-architecture-net-10--cicd)
   - [3.3. Yêu cầu 3: BE DEV tạo các Services giao tiếp với nhau (Microservices Pipeline) + CI/CD](#33-yêu-cầu-3-be-dev-tạo-các-services-giao-tiếp-với-nhau-microservices-pipeline--cicd)
4. [CHƯƠNG 4: HIỆN THỰC CHI TIẾT & CÔNG NGHỆ SỬ DỤNG](#chương-4-hiện-thực-chi-tiết--công-nghệ-sử-dụng)
5. [CHƯƠNG 5: QUY TRÌNH KIỂM THỬ (TESTING) & PIPELINE CI/CD DEVOPS](#chương-5-quy-trình-kiểm-thử-testing--pipeline-cicd-devops)
6. [CHƯƠNG 6: TIẾN ĐỘ THỰC HIỆN (TUẦN 7 & TUẦN 11-12) & KẾT LUẬN](#chương-6-tiến-độ-thực-hiện-tuần-7--tuần-11-12--kết-luận)

---

## CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & BỐI CẢNH THỰC TIỄN

### 1.1. Bối cảnh
Việt Nam sở hữu kho tàng di sản văn hóa, lịch sử và thiên nhiên đồ sộ được UNESCO vinh danh (Văn Miếu - Quốc Tử Giám, Vịnh Hạ Long, Phố cổ Hội An, Cố đô Huế, Dinh Độc Lập...). Tuy nhiên:
- Số lượng hướng dẫn viên du lịch chuyên nghiệp thông thạo nhiều thứ tiếng (Anh, Pháp, Trung, Nhật, Hàn) còn hạn chế và chi phí thuê cao.
- Các biển bảng thuyết minh truyền thống bằng chữ tĩnh chỉ cung cấp thông tin ngắn, đơn điệu, không tạo cảm xúc trải nghiệm sống động cho du khách quốc tế.
- Thiếu các giải pháp số hóa di động hỗ trợ phụ đề song ngữ và giọng đọc bản địa truyền cảm.

### 1.2. Mục tiêu đồ án
Đề tài **"Thuyết minh tự động đa ngôn ngữ"** ra đời nhằm giải quyết toàn diện bài toán trên:
1. Tự động hóa quá trình sinh nội dung thuyết minh dựa trên AI sinh kịch bản văn hóa chuyên sâu.
2. Dịch thuật đa ngôn ngữ ngữ cảnh văn hóa cao (6 ngôn ngữ: Tiếng Việt, English, Français, 中文, 日本語, 한국어).
3. Tổng hợp giọng đọc nhân tạo (Text-to-Speech) chất lượng cao, truyền cảm.
4. Đồng bộ phụ đề song ngữ thời gian thực dạng Karaoke (Karaoke Subtitles Timestamps).
5. Hỗ trợ đa nền tảng toàn diện: Web Browser (React.js/Next.js) và Điện thoại di động (React Native).

---

## CHƯƠNG 2: ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS & USE CASES)

### 2.1. Yêu cầu chức năng (Functional Requirements - FR)
- **FR-01 (Quản lý điểm đến di sản)**: Cho phép người dùng duyệt và chọn các địa danh di sản tiêu biểu với bộ lọc theo loại hình (UNESCO, Quốc gia, Danh lam thắng cảnh).
- **FR-02 (Tùy biến địa danh & văn bản)**: Cho phép người dùng nhập bất kỳ địa danh tùy ý hoặc đoạn văn bản giới thiệu riêng để hệ thống tự động sinh bài thuyết minh tương ứng.
- **FR-03 (Cấu hình thuyết minh đa ngữ)**: Lựa chọn ngôn ngữ đích (6 thứ tiếng), phong cách thuyết minh (Truyền cảm, Hàn lâm, Kể chuyện, Súc tích) và độ dài (1 phút, 3 phút, 5 phút).
- **FR-04 (Trình phát âm thanh tương tác - Audio Player)**: Phát, tạm dừng, dừng phát âm thanh thuyết minh, tùy chỉnh tốc độ đọc (0.8x, 1.0x, 1.2x).
- **FR-05 (Đồng bộ phụ đề song ngữ trực quan)**: Hiển thị phụ đề thời gian thực theo từng phân đoạn (timestamps `00:00 -> 00:30`, `00:30 -> 01:05`...), tự động highlight phân đoạn đang được đọc; cho phép bấm vào từng đoạn để nghe riêng biệt.
- **FR-06 (Xuất dữ liệu chuẩn quốc tế)**: Tải file phụ đề chuẩn `.SRT` và file kịch bản `.JSON`.

### 2.2. Yêu cầu phi chức năng (Non-Functional Requirements - NFR)
- **Hiệu năng (Performance)**: Thời gian khởi tạo kịch bản < 2.0s; độ trễ phát âm thanh < 200ms.
- **Khả năng mở rộng (Scalability)**: Kiến trúc Microservices cho phép mở rộng độc lập các dịch vụ Dịch thuật (Translation), Đọc giọng (TTS) và Lưu trữ (Storage).
- **Khả năng tương thích (Compatibility)**: Hoạt động trơn tru trên mọi trình duyệt hiện đại (Chrome, Edge, Safari, Firefox) và hệ điều hành di động (Android, iOS).
- **Bảo mật (Security)**: Tuân thủ quy định bảo vệ dữ liệu cá nhân Nghị định 13/2023/NĐ-CP; toàn bộ khóa API được bảo vệ qua biến môi trường bí mật và quét bảo mật qua Gitleaks CI.

---

## CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC HỆ THỐNG & 3 YÊU CẦU CỦA ĐỒ ÁN

Bám sát chính xác từng yêu cầu trong slide đồ án của Giảng viên **ThS. Nguyễn Quốc Huy**:

```
+-----------------------------------------------------------------------------------+
|               HỆ THỐNG THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ (VIETAI-LIFE)             |
+-----------------------------------------------------------------------------------+
                                        |
      +---------------------------------+---------------------------------+
      |                                                                   |
[YÊU CẦU 1: FE DEV]                                              [YÊU CẦU 2 & 3: BE DEV]
- Next.js 15 + React 19 (Web)                                    - .NET 10 Clean Architecture
- React Native Mobile (Expo)                                     - Kiến trúc 3 Lớp (3-Tier)
- Audio Player + Karaoke Subtitles                               - Microservices Pipeline:
- CI/CD: Lint, TypeCheck, Build                                    Translation -> TTS -> Storage
                                                                 - CI/CD: Restore, Build, Tests
```

### 3.1. Yêu cầu 1: FE DEV (React.js Web & React Native Mobile) + CI/CD
- **Giao diện Web chuyên nghiệp**:
  - Xây dựng trên **Next.js 15 (React 19)** với phong cách thiết kế hiện đại Glassmorphism, chuẩn Apple VisionOS Dock.
  - Tích hợp bộ icon chuyên dụng từ **Lucide-React** (`Radio`, `Languages`, `MapPin`, `FileAudio`, `Server`...).
  - Trình phát âm thanh tương tác: Web Speech Synthesis API với giọng đọc chuẩn theo từng mã vùng ngôn ngữ (`vi-VN`, `en-US`, `fr-FR`, `zh-CN`, `ja-JP`, `ko-KR`).
  - Giao diện phụ đề Karaoke thời gian thực (Real-time Karaoke Subtitles) trực quan hóa từng timestamp.
- **Giao diện Mobile (React Native)**:
  - Triển khai tệp `apps/mobile/App.tsx` với thiết kế di động tối ưu: Destination Cards trượt ngang, thanh chuyển đổi 6 ngôn ngữ nhanh, Audio Controller với hiển thị phụ đề song ngữ và sơ đồ luồng kiến trúc Microservices.
- **CI/CD Frontend**:
  - Tự động hóa kiểm tra cú pháp, Type-check TypeScript và build production thông qua GitHub Actions (`.github/workflows/ci.yml`).

### 3.2. Yêu cầu 2: BE DEV theo hướng 3 lớp (3-Tier Architecture .NET 10) + CI/CD
Hệ thống Backend được thiết kế theo đúng mô hình **Kiến trúc 3 Lớp (3-Tier Architecture / Clean Architecture)** trên nền tảng **.NET 10**:

1. **Lớp 1: Presentation Tier (API Layer)**
   - Vị trí: `services/api/src/API/Controllers/ApiControllers.cs` (`NarrationController`).
   - Nhiệm vụ: Tiếp nhận yêu cầu HTTP từ client (Web/Mobile), xác thực đầu vào, xử lý phản hồi HTTP và mã lỗi chuẩn RESTful.
   - Endpoints:
     - `POST /api/v1/narration/generate`: Tiếp nhận yêu cầu sinh thuyết minh đa ngữ.
     - `GET /api/v1/narration/destinations`: Cung cấp danh mục các điểm di sản có sẵn.

2. **Lớp 2: Business Logic / Application Tier**
   - Vị trí: `services/api/src/Application/Services/NarrationService.cs`.
   - Nhiệm vụ: Chứa toàn bộ nghiệp vụ lõi (Business Logic), điều phối kịch bản, phân tách đoạn kịch bản thành các mốc thời gian (timestamps), điều phối các microservices con.
   - Định nghĩa Interface độc lập: `INarrationService`, `ITranslationService`, `ITextToSpeechService`, `IMediaStorageService` tại `CoreInterfaces.cs`.

3. **Lớp 3: Data Access / Infrastructure Tier**
   - Vị trí: `services/api/src/Infrastructure/Services/NarrationMicroservices.cs` và `Persistence/ApplicationDbContext.cs`.
   - Nhiệm vụ: Hiện thực các dịch vụ kỹ thuật hạ tầng, truy xuất cơ sở dữ liệu Entity Framework Core, kết nối dịch vụ lưu trữ file và API bên ngoài.

### 3.3. Yêu cầu 3: BE DEV tạo các Services giao tiếp với nhau (Microservices Pipeline) + CI/CD
Nhằm đảm bảo tính mở rộng cao và phân tách trách nhiệm (Separation of Concerns), hệ thống cài đặt luồng giao tiếp giữa các dịch vụ (Inter-Service Communication) theo quy trình chuẩn:

```
[Client (Web/Mobile)]
         │
         ▼  (HTTP POST /api/v1/narration/generate)
┌─────────────────────────────────────────────────────────────┐
│ 1. Narration Orchestrator Service (Application Tier)        │
│    - Tiếp nhận yêu cầu, phân tách cấu trúc phân đoạn        │
└────────┬──────────────────────────┬─────────────────────────┘
         │                          │
         ▼ (Giao tiếp Service 1)     ▼ (Giao tiếp Service 2)
┌─────────────────────────┐  ┌───────────────────────────────┐
│ 2. Translation Service  │  │ 3. Text-To-Speech (TTS)       │
│    (Dịch thuật 6 ngôn   │  │    Service                    │
│    ngữ theo ngữ cảnh)   │  │    (Tổng hợp giọng đọc Audio) │
└────────┬────────────────┘  └──────┬────────────────────────┘
         │                          │
         └───────────┬──────────────┘
                     │ (Giao tiếp Service 3)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Media Storage Service                                    │
│    - Lưu tệp âm thanh MP3                                   │
│    - Sinh và lưu tệp phụ đề song ngữ chuẩn SRT / VTT        │
└─────────────────────────────────────────────────────────────┘
```

- **Mã nguồn hiện thực**:
  - `TranslationService` (`ITranslationService`): Chịu trách nhiệm dịch thuật ngữ cảnh văn hóa di sản.
  - `TextToSpeechService` (`ITextToSpeechService`): Tổng hợp luồng dữ liệu âm thanh (`MemoryStream`).
  - `MediaStorageService` (`IMediaStorageService`): Lưu trữ và phát hành URL âm thanh và URL phụ đề `.srt`.
  - `NarrationService`: Đóng vai trò Orchestrator kết nối và điều phối tuần tự 3 dịch vụ trên.

---

## CHƯƠNG 4: HIỆN THỰC CHI TIẾT & CÔNG NGHỆ SỬ DỤNG

| Hạng mục | Công nghệ sử dụng | Phiên bản | Ghi chú |
|---|---|---|---|
| **Frontend Web** | Next.js, React, Tailwind CSS | Next.js 15, React 19 | App Router, SSR & Client State |
| **Frontend Mobile** | React Native, Expo SDK | SDK 54 / RN 0.79 | Đa nền tảng Android & iOS |
| **Backend Framework** | ASP.NET Core, C# | .NET 10 (net10.0) | Hiệu năng cao, kiến trúc 3 lớp |
| **ORM & Database** | Entity Framework Core, SQLite/PostgreSQL | EF Core 10.0 | Code-First Migrations |
| **AI Narration Engine** | DeepSeek V3 Live API / Web Speech API | Live 2026 | Kịch bản chuyên sâu & TTS đa ngữ |
| **DevOps & CI/CD** | GitHub Actions, Docker | Actions v4, Docker Buildx | Pipeline tự động hóa build & test |
| **Kiểm thử** | xUnit, Moq, FluentAssertions | Latest | Kiểm thử đơn vị & tích hợp |

---

## CHƯƠNG 5: QUY TRÌNH KIỂM THỬ (TESTING) & PIPELINE CI/CD DEVOPS

### 5.1. Kiểm thử Backend (.NET 10 Unit & Integration Tests)
Mã nguồn kiểm thử nằm tại `services/api/tests/UnitTests/UnitTests.cs` và `Program.cs`.
- **Test Suite 1: TrustLayerValidatorTests**: Kiểm thử 3 trường hợp về mức độ tin cậy epistemic và phòng chống tấn công XSS.
- **Test Suite 2: TokenServiceTests**: Kiểm thử tạo và xác thực JWT Access Token & Refresh Token.
- **Test Suite 3: NarrationServiceIntegrationTests**: Kiểm thử tích hợp toàn bộ luồng giao tiếp giữa 4 Microservices:
  - `translationMock.Verify(..., Times.AtLeast(3))`
  - `ttsMock.Verify(..., Times.Once)`
  - `storageMock.Verify(SaveAudioNarrationAsync, Times.Once)`
  - `storageMock.Verify(SaveSubtitleFileAsync, Times.Once)`
- **Kết quả kiểm thử thực tế**:
  ```
  =================================================================
   VietAI-Life .NET 10 Automated Test Suite
   Testing 3-Tier Architecture & Inter-Service Narration Pipeline
  =================================================================
   [PASS] TrustLayerValidatorTests (3 assertions passed)
   [PASS] TokenServiceTests (2 assertions passed)
   [PASS] NarrationServiceIntegrationTests (Microservices communication passed)
  =================================================================
   Summary: 6 passed, 0 failed.
  =================================================================
  ```

### 5.2. Kiểm thử Frontend Web (Next.js 15 Production Build)
Lệnh build thực thi: `npm run build` tại `apps/web`.
- Kết quả: **Compiled successfully** với 0 lỗi cú pháp, 0 lỗi TypeScript:
  - Route `/` (Static 30 kB): Giao diện Thuyết minh & Trợ lý đa năng.
  - Route `/api/narration` (Dynamic): API Endpoint kịch bản thuyết minh.
  - Route `/api/chat` (Dynamic): API Endpoint trợ lý AI DeepSeek V3.

### 5.3. Pipeline CI/CD trên GitHub Actions
- **Tệp `.github/workflows/ci.yml`**:
  - Job `backend-ci`: Tự động setup .NET 10 SDK, restore dependencies, build Release và chạy tự động toàn bộ Unit Tests.
  - Job `frontend-web-ci`: Setup Node 24, install dependencies, type-check và build Next.js.
  - Job `frontend-mobile-ci`: Kiểm tra cú pháp và tính toàn vẹn của mã nguồn React Native Mobile.
  - Job `security-scan`: Quét bảo mật tự động mã nguồn bằng Gitleaks ngăn ngừa rò rỉ secret key.
- **Tệp `.github/workflows/cd.yml`**:
  - Đóng gói Docker Images cho Web và Backend API, sẵn sàng cho triển khai liên tục (Continuous Deployment).

---

## CHƯƠNG 6: TIẾN ĐỘ THỰC HIỆN (TUẦN 7 & TUẦN 11-12) & KẾT LUẬN

### 6.1. Tiến độ thực hiện theo lịch trình đồ án
- **Tuần 7 (Kiểm tra tiến độ giữa kỳ)**:
  - [x] Khảo sát đề tài và thiết kế Use Cases hệ thống thuyết minh tự động.
  - [x] Xây dựng khung kiến trúc 3 lớp trên .NET 10.
  - [x] Hiện thực 3 Microservices con (Translation, TTS, Storage) và viết Unit Tests kiểm thử giao tiếp dịch vụ.
  - [x] Thiết lập kho mã nguồn GitHub và cấu hình CI/CD tự động hóa.
  - [x] Xây dựng giao diện cơ bản trên Web và Mobile.
- **Tuần 11 - 12 (Báo cáo cuối kỳ)**:
  - [x] Hoàn thiện 100% giao diện Web React.js/Next.js với hiệu ứng Karaoke Subtitles song ngữ thời gian thực.
  - [x] Hoàn thiện 100% giao diện Mobile React Native với điều khiển Audio Player và thẻ di tích linh hoạt.
  - [x] Tích hợp AI sinh kịch bản thuyết minh thực tế (DeepSeek V3 Live) và hỗ trợ 6 ngôn ngữ quốc tế.
  - [x] Hoàn tất bộ tài liệu báo cáo khoa học chi tiết `BAO_CAO_DO_AN_CNPM_THUYET_MINH_DA_NGON_NGU.md`.

### 6.2. Kết luận
Đồ án **"Thuyết minh tự động đa ngôn ngữ"** đã giải quyết trọn vẹn và chuẩn xác cả 3 yêu cầu cốt lõi được giảng viên **ThS. Nguyễn Quốc Huy** đề ra:
1. **FE DEV**: Giao diện chuyên nghiệp, hiện đại trên cả Web (React.js/Next.js) và Mobile (React Native), tích hợp CI/CD.
2. **BE DEV 3 lớp**: Kiến trúc 3 tầng tách biệt rõ ràng (Presentation, Application, Infrastructure) trên .NET 10, tích hợp CI/CD.
3. **BE DEV Services giao tiếp nhau**: Kiến trúc Microservices điều phối kịch bản, dịch thuật, tổng hợp âm thanh và lưu trữ file, được chứng thực qua Unit Tests và CI/CD.

Toàn bộ mã nguồn, cấu hình CI/CD và tài liệu được lưu trữ và quản lý minh bạch tại GitHub:
👉 **[https://github.com/phamvantuyenuit2006-oss/VietAI-Life](https://github.com/phamvantuyenuit2006-oss/VietAI-Life)**

*Bản quyền đồ án thuộc về **Tuyên Phạm** (`@phamvantuyenuit2006-oss`).*
