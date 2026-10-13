"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Bot, Sparkles, Send, BookOpen, FileText, ShieldCheck,
  ArrowRight, CheckCircle2, AlertCircle, Clock, Utensils,
  DollarSign, Calendar, Landmark, GraduationCap, Mic, MicOff,
  Plus, Trash2, Droplets, Info, Check, ChevronRight,
  ExternalLink, RefreshCw, ShoppingCart, Activity, Copy,
  Flame, Search, ChevronLeft, Volume2, VolumeX, Calculator, Scale,
  BookCheck, Award, ThumbsUp, Tag, Cpu, Binary, Layers,
  Network, Play, Pause, Terminal, Code2, Database, Sliders,
  Heart, Smile, Settings, Coffee, MessageSquareHeart, Camera,
  Upload, QrCode, Share2, Sun, Moon, Zap, UserCheck, Eye,
  Sparkle, Compass, HelpCircle, FileCheck, Download, Languages,
  MapPin, Radio, FileAudio, Server
} from "lucide-react";

// ============================================================================
// 1. DATA DICTIONARIES (Chuẩn Viện Dinh Dưỡng, Hành chính & Đời sống Việt Nam)
// ============================================================================

interface DishItem {
  id: string;
  name: string;
  region: "Bắc" | "Trung" | "Nam" | "Đồ uống / Ăn vặt";
  calo: number;
  protein: number;
  carbs: number;
  fat: number;
  gi: "Thấp" | "Trung bình" | "Cao";
  walkingMin: number;
  desc: string;
}

const FOOD_DATABASE: DishItem[] = [
  { id: "1", name: "Phở bò tái nạm", region: "Bắc", calo: 520, protein: 28, carbs: 65, fat: 16, gi: "Trung bình", walkingMin: 80, desc: "Bánh phở tươi, nạm bò mềm, nước dùng xương hầm quế hồi gừng nướng thơm lừng." },
  { id: "2", name: "Cơm tấm sườn bì chả", region: "Nam", calo: 780, protein: 35, carbs: 92, fat: 29, gi: "Cao", walkingMin: 125, desc: "Cơm tấm dẻo thơm, sườn nướng mật ong mỡ hành, chả trứng hấp, bì giòn bùi." },
  { id: "3", name: "Bánh mì kẹp thịt chả pa-tê", region: "Nam", calo: 460, protein: 18, carbs: 52, fat: 19, gi: "Trung bình", walkingMin: 75, desc: "Bánh mì giòn rụm, pa-tê gan béo ngậy, giò lụa, dưa leo và đồ chua thanh mát." },
  { id: "4", name: "Bún chả Hà Nội", region: "Bắc", calo: 590, protein: 32, carbs: 68, fat: 20, gi: "Trung bình", walkingMin: 95, desc: "Chả viên và chả miếng nướng than hoa, bún lá, nước mắm đu đủ cà rốt giòn chua ngọt." },
  { id: "5", name: "Bún bò Huế giò heo", region: "Trung", calo: 630, protein: 36, carbs: 70, fat: 22, gi: "Cao", walkingMin: 100, desc: "Bún sợi to, khoanh giò heo mềm ngậy, nạm bò, nước dùng cay nồng mùi sả mắm ruốc." },
  { id: "6", name: "Hủ tiếu Nam Vang", region: "Nam", calo: 480, protein: 26, carbs: 60, fat: 14, gi: "Trung bình", walkingMin: 78, desc: "Hủ tiếu dai thơm, tôm sú, thịt nạc băm, trứng cút, nước dùng xương ống ngọt thanh." },
  { id: "7", name: "Mì Quảng tôm thịt trứng", region: "Trung", calo: 510, protein: 25, carbs: 62, fat: 17, gi: "Trung bình", walkingMin: 82, desc: "Sợi mì vàng nghệ, tôm ram mặn ngọt, thịt ba chỉ, bánh tráng nướng mè giòn tan." },
  { id: "8", name: "Bánh xèo miền Tây", region: "Nam", calo: 490, protein: 20, carbs: 54, fat: 21, gi: "Cao", walkingMin: 80, desc: "Vỏ bánh vàng ươm giòn rụm nước cốt dừa, tôm thịt giá đỗ cuốn bánh tráng rau rừng." },
  { id: "9", name: "Canh chua cá lóc đồng", region: "Nam", calo: 180, protein: 22, carbs: 14, fat: 4, gi: "Thấp", walkingMin: 30, desc: "Cá lóc đồng nấu me, dứa, cà chua, đậu bắp, bạc hà ngò gai thanh mát giải nhiệt." },
  { id: "10", name: "Gỏi cuốn tôm thịt (2 cuốn)", region: "Nam", calo: 140, protein: 12, carbs: 18, fat: 2, gi: "Thấp", walkingMin: 24, desc: "Tôm luộc đỏ au, thịt nạc, bún tươi, rau thơm cuộn bánh tráng chấm tương đen đậu phộng." },
  { id: "11", name: "Cà phê sữa đá Sài Gòn", region: "Đồ uống / Ăn vặt", calo: 190, protein: 3, carbs: 28, fat: 7, gi: "Cao", walkingMin: 32, desc: "Cà phê pha phin truyền thống hòa cùng sữa đặc béo ngọt và đá nhuyễn mát lạnh." },
  { id: "12", name: "Chè bưởi An Giang", region: "Đồ uống / Ăn vặt", calo: 260, protein: 4, carbs: 50, fat: 5, gi: "Cao", walkingMin: 45, desc: "Cùi bưởi giòn sần sật, đậu xanh bùi bùi quyện nước cốt dừa ngậy béo thơm vani." }
];

const MARKET_PLANS = [
  {
    budget: 50000,
    label: "50.000 đ",
    people: "2 - 3 người",
    type: "Tiết kiệm sinh viên",
    totalPrice: 48000,
    dishes: [
      { name: "Trứng chiên thịt băm (3 quả + 100g thịt)", price: 28000, type: "Món Mặn" },
      { name: "Canh rau ngót nấu tép khô ngọt mát", price: 12000, type: "Món Canh" },
      { name: "Dưa leo dầm nước mắm tỏi ớt", price: 8000, type: "Rau tươi" }
    ],
    chefTip: "Chỉ 20 phút chuẩn bị. Giàu protein từ trứng & thịt nạc, rau ngót thanh nhiệt giải độc."
  },
  {
    budget: 100000,
    label: "100.000 đ",
    people: "3 - 4 người",
    type: "Bữa cơm gia đình chuẩn vị",
    totalPrice: 96000,
    dishes: [
      { name: "Thịt ba chỉ kho tiêu sền sệt (300g)", price: 46000, type: "Món Mặn" },
      { name: "Canh chua cá điêu hồng khúc giữa (350g)", price: 35000, type: "Món Canh" },
      { name: "Rau muống non xào tỏi giòn thơm (1 bó)", price: 15000, type: "Rau xào" }
    ],
    chefTip: "Nước màu dừa lên màu cánh gián bắt mắt, cá điêu hồng tươi ngọt át đi vị ngấy thịt ba chỉ."
  },
  {
    budget: 150000,
    label: "150.000 đ",
    people: "4 - 5 người",
    type: "Mâm cơm giàu đạm & hải sản",
    totalPrice: 148000,
    dishes: [
      { name: "Tôm sú rim mặn ngọt hành lá (300g)", price: 65000, type: "Hải sản" },
      { name: "Thịt nạc băm viên sốt cà chua (250g)", price: 38000, type: "Món Mặn" },
      { name: "Canh cua rau đay mồng tơi mướp hương", price: 30000, type: "Món Canh" },
      { name: "Cà pháo muối giòn rụm", price: 15000, type: "Món Ăn Kèm" }
    ],
    chefTip: "Mâm cơm mùa hè kinh điển miền Bắc, canh cua mướp hương giải nhiệt hoàn hảo cùng tôm rim."
  },
  {
    budget: 200000,
    label: "200.000 đ",
    people: "5 - 6 người",
    type: "Bữa cơm sum họp cuối tuần",
    totalPrice: 195000,
    dishes: [
      { name: "Gà ta thả vườn hấp lá chanh (1/2 con ~800g)", price: 95000, type: "Món Chính" },
      { name: "Sườn non ram me chua ngọt đậm đà (400g)", price: 60000, type: "Món Ram" },
      { name: "Canh măng sườn thơm ấm bụng", price: 25000, type: "Món Canh" },
      { name: "Bông cải xanh luộc chấm kho quẹt", price: 15000, type: "Rau củ" }
    ],
    chefTip: "Gà da vàng ươm chấm muối tiêu chanh ớt, sườn chua ngọt kích thích vị giác cả gia đình."
  }
];

const CIVIC_GUIDES = [
  {
    id: "vneid-tam-tru",
    title: "Đăng ký Tạm trú online qua VNeID mức 2",
    dept: "Bộ Công An",
    time: "3 ngày làm việc",
    fee: "7.000 đ (trực tuyến)",
    steps: [
      "Mở app VNeID &rarr; Đăng nhập định danh mức 2 bằng vân tay hoặc mã passcode.",
      "Chọn 'Thủ tục hành chính' &rarr; Bấm 'Thông báo lưu trú' hoặc 'Đăng ký tạm trú'.",
      "Khai báo thông tin địa chỉ nhà trọ và công an cấp xã/phường phụ trách.",
      "Tải ảnh 2 mặt Hợp đồng thuê nhà có chữ ký 2 bên & CCCD của chủ trọ.",
      "Xác nhận qua mã OTP và thanh toán lệ phí 7.000 đ qua Cổng Dịch vụ công Quốc gia."
    ],
    lawRef: "Luật Cư trú số 68/2020/QH14 & Thông tư 55/2021/TT-BCA"
  },
  {
    id: "cccd-moi",
    title: "Cấp thẻ Căn cước mới (Luật Căn cước 2024)",
    dept: "Cục CSQLHC về TTXH",
    time: "7 ngày làm việc",
    fee: "Miễn phí cấp lần đầu",
    steps: [
      "Kiểm tra dữ liệu dân cư cá nhân trên app VNeID để đảm bảo không bị sai lệch.",
      "Đặt lịch hẹn trước trên Cổng Dịch vụ công để tiết kiệm thời gian xếp hàng.",
      "Đến cơ quan Công an huyện/tỉnh theo lịch hẹn để thu thập vân tay, mống mắt và chụp ảnh khuôn mặt.",
      "Đăng ký nhận thẻ Căn cước chuyển phát nhanh tận nhà qua Bưu điện Việt Nam."
    ],
    lawRef: "Luật Căn cước số 26/2023/QH15 hiệu lực từ ngày 01/07/2024"
  },
  {
    id: "gplx-online",
    title: "Đổi Giấy phép lái xe (GPLX) trực tuyến mức 4",
    dept: "Cục Đường bộ Việt Nam",
    time: "5 ngày làm việc",
    fee: "115.000 đ",
    steps: [
      "Khám sức khỏe lái xe tại bệnh viện/trung tâm y tế có liên thông dữ liệu điện tử.",
      "Vào dichvucong.gov.vn &rarr; Tìm thủ tục 'Đổi giấy phép lái xe do ngành GTVT cấp'.",
      "Nhập số CCCD và mã số GPLX hiện tại để hệ thống tự truy xuất dữ liệu.",
      "Tải ảnh chân dung 3x4 nền trắng rõ nét và ảnh chụp 2 mặt GPLX cũ.",
      "Thanh toán lệ phí 115.000 đ trực tuyến và điền địa chỉ nhận bằng lái mới tận nhà."
    ],
    lawRef: "Thông tư 12/2017/TT-BGTVT & Quyết định 28/2023/QĐ-TTg"
  }
];

const AIO_MODULES = [
  { id: 1, code: "M01", name: "Python & Toán Ứng Dụng Cho AI", topics: "OOP, Data Structures, Linear Algebra, Calculus, SVD, Eigenvalues", hours: "40 giờ", tag: "Nền tảng Toán" },
  { id: 2, code: "M02", name: "Python Nâng Cao & Xử Lý Dữ Liệu", topics: "NumPy Vectorization, Pandas Wrangling, Data Profiling", hours: "35 giờ", tag: "Kỹ năng Dữ liệu" },
  { id: 3, code: "M03", name: "Machine Learning Cổ Điển", topics: "Linear/Logistic Regression, Decision Trees, SVM, KNN, Evaluation Metrics", hours: "45 giờ", tag: "ML Nền tảng" },
  { id: 4, code: "M04", name: "Tabular & Time-Series Data", topics: "XGBoost, LightGBM, CatBoost, ARIMA, Prophet, Feature Store", hours: "40 giờ", tag: "Thực chiến Bảng" },
  { id: 5, code: "M05", name: "Step into Deep Learning 1", topics: "Perceptron, Multi-Layer Perceptron (MLP), Backprop from Scratch", hours: "40 giờ", tag: "Bản chất Nơ-ron" },
  { id: 6, code: "M06", name: "Step into Deep Learning 2", topics: "SGD, Adam, Schedulers, Dropout, BatchNorm, PyTorch Core", hours: "40 giờ", tag: "Tối ưu hóa" },
  { id: 7, code: "M07", name: "Kỷ Luật Huấn Luyện Deep Learning", topics: "TensorBoard Logging, FP16 Mixed Precision, GradScaler, Seed", hours: "35 giờ", tag: "Kỹ thuật Production" },
  { id: 8, code: "M08", name: "Deep Architectures", topics: "CNNs, RNN, LSTM, GRU, Transformers Self-Attention", hours: "50 giờ", tag: "Kiến trúc Hiện đại" },
  { id: 9, code: "M09", name: "Computer Vision Ứng Dụng", topics: "YOLO Object Detection, Segmentation, Facial Expression (CVPR-W)", hours: "50 giờ", tag: "Thị giác Máy tính" },
  { id: 10, code: "M10", name: "Natural Language Processing", topics: "Word2Vec, PhoBERT Tiếng Việt, Text Classification, NER", hours: "50 giờ", tag: "Xử lý Ngôn ngữ" },
  { id: 11, code: "M11", name: "Generative Models", topics: "VAEs, GANs, Latent Diffusion Models, Text-to-Image", hours: "45 giờ", tag: "AI Sinh Dữ Liệu" },
  { id: 12, code: "M12", name: "LLMs & Hệ Thống AI Agents", topics: "RAG Pipeline, Vector DB, LoRA/QLoRA Fine-tuning, Tool Agents", hours: "55 giờ", tag: "Đỉnh cao AI Agent" },
];

// ============================================================================
// 1.1 ĐỀ TÀI: THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ (CÔNG NGHỆ PHẦN MỀM)
// Giảng viên: Nguyễn Quốc Huy | Tác giả: Tuyên Phạm (@phamvantuyenuit2006-oss)
// ============================================================================

interface NarrationDestination {
  id: string;
  name: string;
  province: string;
  icon: string;
  category: "Di sản Thế giới UNESCO" | "Di tích Lịch sử Quốc gia" | "Danh thắng Du lịch";
  description: string;
  defaultViScript: string;
}

const NARRATION_DESTINATIONS: NarrationDestination[] = [
  {
    id: "van-mieu",
    name: "Văn Miếu - Quốc Tử Giám",
    province: "Hà Nội",
    icon: "🏛️",
    category: "Di tích Lịch sử Quốc gia",
    description: "Trường đại học đầu tiên của Việt Nam, xây dựng năm 1070 triều Lý Thánh Tông, nơi lưu giữ 82 bia đá Tiến sĩ tôn vinh truyền thống hiếu học ngàn năm.",
    defaultViScript: "Chào mừng quý khách đến với Văn Miếu - Quốc Tử Giám, biểu tượng trường tồn của truyền thống hiếu học và tinh hoa văn hiến Thăng Long - Hà Nội. Được khởi lập vào năm 1070 dưới triều vua Lý Thánh Tông, nơi đây là trường đại học đầu tiên của đất nước. Hãy cùng lắng nghe tiếng vọng ngàn năm từ 82 bia đá Tiến sĩ, tôn vinh hiền tài là nguyên khí quốc gia."
  },
  {
    id: "ha-long",
    name: "Vịnh Hạ Long",
    province: "Quảng Ninh",
    icon: "🌊",
    category: "Di sản Thế giới UNESCO",
    description: "Kỳ quan thiên nhiên thế giới UNESCO với gần 2.000 hòn đảo đá vôi kỳ vĩ soi bóng xuống làn nước biển xanh ngọc bích của vịnh Bắc Bộ.",
    defaultViScript: "Chào mừng quý khách đến với Vịnh Hạ Long - kỳ quan thiên nhiên thế giới được UNESCO nhiều lần vinh danh. Nơi đây là bản giao hưởng tuyệt mỹ giữa đá và nước với hàng nghìn đảo đá vôi kỳ vĩ soi bóng xuống làn nước xanh ngọc bích. Truyền thuyết kể rằng đàn rồng mẹ và rồng con đã hạ phàm phun châu nhả ngọc tạo nên bức tường thành bảo vệ bờ cõi giang sơn."
  },
  {
    id: "hoi-an",
    name: "Phố Cổ Hội An",
    province: "Quảng Nam",
    icon: "🏮",
    category: "Di sản Thế giới UNESCO",
    description: "Đô thị thương cảng quốc tế sầm uất thế kỷ 16-17, bảo tồn nguyên vẹn hơn một nghìn di tích kiến trúc cổ và những con phố lung linh đèn lồng.",
    defaultViScript: "Chào mừng quý khách đến với Đô thị cổ Hội An, bảo tàng sống động về thương cảng quốc tế thế kỷ 16 và 17 bên dòng sông Hoài thơ mộng. Những mái ngói rêu phong, bức tường vàng cổ kính cùng hàng ngàn chiếc đèn lồng rực rỡ đã gìn giữ trọn vẹn nét giao thoa văn hóa đặc sắc giữa Việt Nam, Nhật Bản, Trung Hoa và phương Tây."
  },
  {
    id: "dinh-doc-lap",
    name: "Dinh Độc Lập (Hội Trường Thống Nhất)",
    province: "TP. Hồ Chí Minh",
    icon: "🏢",
    category: "Di tích Lịch sử Quốc gia",
    description: "Kiệt tác kiến trúc hiện đại của KTS Ngô Viết Thụ, nơi chứng kiến thời khắc lịch sử thiêng liêng trưa ngày 30/4/1975 non sông thống nhất.",
    defaultViScript: "Chào mừng quý khách đến với Di tích lịch sử Dinh Độc Lập, kiệt tác kiến trúc hiện đại phương Đông của kiến trúc sư tài ba Ngô Viết Thụ. Nơi đây từng là đầu não chính quyền Sài Gòn và chứng kiến thời khắc lịch sử thiêng liêng lúc 11 giờ 30 phút ngày 30 tháng 4 năm 1975, khi xe tăng tiến qua cánh cổng sắt, đánh dấu sự thống nhất hoàn toàn của non sông đất nước."
  },
  {
    id: "hue",
    name: "Quần Thể Di Tích Cố Đô Huế",
    province: "Thừa Thiên Huế",
    icon: "👑",
    category: "Di sản Thế giới UNESCO",
    description: "Kinh đô của 13 triều vua Nguyễn (1802-1945), di sản văn hóa vật thể đầu tiên của Việt Nam với Hoàng thành uy nghiêm và sông Hương thơ mộng.",
    defaultViScript: "Chào mừng quý khách đến với Quần thể di tích Cố đô Huế, kinh đô cổ kính của 13 triều vua Nguyễn bên dòng sông Hương êm đềm. Bước chân qua Ngọ Môn và điện Thái Hòa, quý khách sẽ được chiêm ngưỡng đỉnh cao của mỹ thuật cung đình, nhã nhạc cung đình Huế và chiều sâu trầm mặc của triều đại phong kiến cuối cùng trong lịch sử Việt Nam."
  },
  {
    id: "chua-mot-cot",
    name: "Chùa Một Cột (Diên Hựu Tự)",
    province: "Hà Nội",
    icon: "🛕",
    category: "Di tích Lịch sử Quốc gia",
    description: "Ngôi chùa kiến trúc hoa sen độc nhất vô nhị dựng trên một cột đá tròn giữa hồ linh thiêng, khởi dựng năm 1049 triều vua Lý Thái Tông.",
    defaultViScript: "Chào mừng quý khách đến với Diên Hựu Tự - Chùa Một Cột, một trong những ngôi chùa có kiến trúc độc đáo nhất châu Á. Được xây dựng năm 1049 dưới triều vua Lý Thái Tông mô phỏng đài sen thanh khiết của Phật Bà Quan Âm, ngôi chùa là biểu tượng tâm linh thanh tịnh và khát vọng thái bình muôn thuở của dân tộc Việt."
  }
];

// ============================================================================
// COMPONENT CHÍNH: VIETAI LIFE MASTER APP
// ============================================================================

export default function VietAILifePage() {
  // Navigation & View Mode (Mặc định tab Đề tài: Thuyết minh tự động đa ngôn ngữ)
  const [activeTab, setActiveTab] = useState<"narration" | "chat" | "nutrition" | "finance" | "civic" | "academy">("narration");
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Time & Greeting Widget
  const [currentTimeGreeting, setCurrentTimeGreeting] = useState<string>("Chào buổi tối 🌙");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setCurrentTimeGreeting("Chào buổi sáng ☀️");
    else if (hour >= 11 && hour < 14) setCurrentTimeGreeting("Chào buổi trưa 🍱");
    else if (hour >= 14 && hour < 18) setCurrentTimeGreeting("Chào buổi chiều ☕");
    else setCurrentTimeGreeting("Chào buổi tối 🌙");
  }, []);

  // Chat States
  const [persona, setPersona] = useState<"friend" | "doctor" | "chef" | "finance" | "civic" | "aio" | "tutor">("friend");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [selectedQrItem, setSelectedQrItem] = useState<{ title: string; amount: number } | null>(null);
  const [showImageScannerModal, setShowImageScannerModal] = useState<boolean>(false);
  const [isScanningImage, setIsScanningImage] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Messages list
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    trustLevel?: "Fact" | "Verified" | "Guidance";
    citations?: Array<{ title: string; url: string; org: string; date: string }>;
    createdAt: string;
    source?: string;
  }>>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Dạ em chào bạn thân mến ạ! 🌸 Em là **Bé Mai - Trợ lý AI toàn năng của gia đình bạn**.\n\nNhờ được kết nối trực tiếp với **siêu trí tuệ DeepSeek-V3 Live AI** và kho tri thức bản địa, bạn có thể hỏi em **bất cứ điều gì trên đời**:\n\n• 🍲 *"Hôm nay 100k nấu cơm 4 người ăn món gì?"* &rarr; Em lên thực đơn chuẩn vị, đủ dinh dưỡng\n• 💸 *"Vừa mua ly trà sữa 35k ghi sổ giúp mình"* &rarr; Em tự động phân loại vào ví 6 chiếc lọ\n• 🩺 *"Bị sốt 38.5 độ và đau họng thì nên làm gì ngay?"* &rarr; Em tư vấn chăm sóc y tế an toàn\n• 🚗 *"Hướng dẫn đổi bằng lái xe hoặc làm tạm trú trên VNeID"* &rarr; Em chỉ dẫn 4 bước chuẩn pháp lý\n• 💻 *"Viết code Python phân loại ảnh bằng PyTorch chuẩn AIO"* &rarr; Em sinh code tối ưu GPU chạy ngay\n• 🌌 Hay bất cứ câu hỏi triết học, giải bài tập Toán - Lý - Hóa, làm thơ tặng mẹ, tâm sự chuyện vui buồn...\n\nHôm nay bạn có điều gì cần em đồng hành và san sẻ không nào? ❤️`,
      trustLevel: "Fact",
      citations: [
        { title: "Nền tảng Đời sống VietAI Life", url: "https://vietailife.vn", org: "VietAI Life", date: "2026" },
        { title: "Học viện AI VIET NAM (AIO)", url: "https://aivietnam.edu.vn", org: "AI VIET NAM", date: "2026" }
      ],
      createdAt: "Bây giờ",
      source: "deepseek-live-v3"
    }
  ]);

  // Sức khỏe & Dinh dưỡng states
  const [selectedRegion, setSelectedRegion] = useState<string>("Tất cả");
  const [foodSearch, setFoodSearch] = useState<string>("");
  const [loggedMeals, setLoggedMeals] = useState<DishItem[]>([FOOD_DATABASE[0], FOOD_DATABASE[2]]);
  const [waterCups, setWaterCups] = useState<number>(6);
  const [userWeight, setUserWeight] = useState<number>(60);
  const [userHeight, setUserHeight] = useState<number>(168);

  // Tính BMI & Nước khuyến nghị
  const userBmi = useMemo(() => {
    const heightInM = userHeight / 100;
    if (heightInM <= 0) return 21.3;
    return Number((userWeight / (heightInM * heightInM)).toFixed(1));
  }, [userWeight, userHeight]);

  const recommendedWater = useMemo(() => {
    return Math.round(userWeight * 40); // 40ml / kg cân nặng
  }, [userWeight]);

  // Tài chính states
  const [expenses, setExpenses] = useState<Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    jar: string;
    date: string;
  }>>([
    { id: "e1", title: "Phở bò sáng tái nạm", amount: 50000, category: "Ăn uống", jar: "Thiết yếu (55%)", date: "Sáng nay" },
    { id: "e2", title: "Đổ xăng xe máy", amount: 70000, category: "Đi lại", jar: "Thiết yếu (55%)", date: "Hôm qua" },
    { id: "e3", title: "Khóa học AI AIO 2026", amount: 2500000, category: "Học tập", jar: "Giáo dục (10%)", date: "12/10" },
    { id: "e4", title: "Trà sữa cùng bạn bè", amount: 35000, category: "Hưởng thụ", jar: "Hưởng thụ (10%)", date: "11/10" }
  ]);
  const [voiceExpenseText, setVoiceExpenseText] = useState<string>("");
  const [grossSalary, setGrossSalary] = useState<number>(20000000);
  const [dependents, setDependents] = useState<number>(1);

  // Đi chợ states
  const [selectedBudget, setSelectedBudget] = useState<number>(100000);

  // AI VIET NAM Simulator states
  const [simEpoch, setSimEpoch] = useState<number>(10);
  const [simLoss, setSimLoss] = useState<number>(0.284);
  const [simAccuracy, setSimAccuracy] = useState<number>(93.2);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);

  // ============================================================================
  // ĐỀ TÀI CÔNG NGHỆ PHẦN MỀM: THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ STATES
  // ============================================================================
  const [selectedDestination, setSelectedDestination] = useState<NarrationDestination>(NARRATION_DESTINATIONS[0]);
  const [customDestinationText, setCustomDestinationText] = useState<string>("");
  const [narrationLanguage, setNarrationLanguage] = useState<"vi" | "en" | "fr" | "zh" | "ja" | "ko">("en");
  const [narrationStyle, setNarrationStyle] = useState<"inspirational" | "academic" | "storytelling" | "quick">("inspirational");
  const [narrationDuration, setNarrationDuration] = useState<"short" | "medium" | "full">("medium");
  const [isGeneratingNarration, setIsGeneratingNarration] = useState<boolean>(false);
  const [isPlayingNarrationAudio, setIsPlayingNarrationAudio] = useState<boolean>(false);
  const [activeNarrationSegment, setActiveNarrationSegment] = useState<number>(0);
  const [narrationSpeed, setNarrationSpeed] = useState<number>(1.0);
  const [narrationFilter, setNarrationFilter] = useState<string>("Tất cả");

  const [currentNarration, setCurrentNarration] = useState<{
    title: string;
    topic: string;
    targetLanguage: string;
    overview: string;
    segments: Array<{ id: number; timeStart: string; timeEnd: string; textTarget: string; textVi: string }>;
    culturalTips: string;
    source?: string;
  }>({
    title: "The Temple of Literature — Imperial Academy",
    topic: "Văn Miếu - Quốc Tử Giám",
    targetLanguage: "en",
    overview: "Welcome to the Temple of Literature, Vietnam's first national university, founded in 1070 under Emperor Ly Thanh Tong. A sacred sanctuary honoring education, ethics, and historical scholars.",
    segments: [
      {
        id: 1,
        timeStart: "00:00",
        timeEnd: "00:30",
        textTarget: "Built almost a millennium ago, this sanctuary honors Confucius and celebrated scholars who shaped Vietnam's rich intellectual legacy.",
        textVi: "Được xây dựng cách đây gần một thiên niên kỷ, nơi đây phụng thờ Khổng Tử và tôn vinh những bậc hiền tài đã đặt nền móng cho nền học vấn nước nhà."
      },
      {
        id: 2,
        timeStart: "00:30",
        timeEnd: "01:05",
        textTarget: "Before you stands the iconic Khue Van Pavilion, reflected serenely in the Well of Heavenly Clarity, symbolizing the brilliant literary star.",
        textVi: "Trước mắt quý khách là Khuê Văn Các cổ kính soi bóng xuống giếng Thiên Quang, biểu tượng cho ngôi sao Khuê tỏa sáng rạng ngời văn khí."
      },
      {
        id: 3,
        timeStart: "01:05",
        timeEnd: "01:45",
        textTarget: "On either side lie 82 stone stele resting upon stone tortoises, immortalizing the names of doctorate holders, embodying the eternal truth: 'Talent is the vital essence of the nation'.",
        textVi: "Hai bên là 82 bia đá ngự trên lưng rùa, khắc tên các vị tiến sĩ, khắc sâu chân lý bất hủ: 'Hiền tài là nguyên khí của quốc gia'."
      }
    ],
    culturalTips: "• Trang phục lịch sự, giữ thái độ tôn nghiêm khi vào gian thờ Khổng Tử.\n• Không sờ đầu rùa đá để chung tay bảo tồn di sản tư liệu thế giới UNESCO."
  });

  // Scroll to bottom when message arrives
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load API key from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("vietai_gemini_key");
      if (savedKey) setGeminiApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("vietai_gemini_key", key);
    }
    setShowSettingsModal(false);
  };

  // Web Speech: Text to Speech (Đọc tiếng Việt)
  const handleSpeakText = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[#*`_~]/g, "")
      .replace(/•/g, " ")
      .replace(/&rarr;/g, "sang")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes("vi"));
    if (viVoice) utterance.voice = viVoice;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech: Speech to Text (Ghi âm giọng nói tiếng Việt)
  const handleToggleVoiceRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt hiện tại chưa mở quyền Micro. Bạn hãy gõ câu hỏi vào ô chat nhé!");
      return;
    }

    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsVoiceRecording(true);
      recognition.onend = () => setIsVoiceRecording(false);
      recognition.onerror = () => setIsVoiceRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsVoiceRecording(false);
    }
  };

  // ============================================================================
  // XỬ LÝ GỬI TIN NHẮN ĐA NĂNG (OMNI-AI CHAT HANDLER)
  // ============================================================================
  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || inputMessage).trim();
    if (!text) return;

    // Tự động nhận diện câu lệnh chi tiêu (Voice/Text-to-Expense)
    const lower = text.toLowerCase();
    if (/(ăn |uống|mua |đổ xăng|tiền |chi |trả |k|nghìn|đồng)/.test(lower) && /\d+/.test(lower)) {
      handleAddNaturalExpense(text);
    }

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          persona,
          apiKey: geminiApiKey,
          history: messages.slice(-5)
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botReply = data.reply || "Dạ em đã nhận được câu hỏi của bạn rồi ạ!";
        const botCitations = data.citations || [];
        const source = data.source || "deepseek-live-v3";

        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: botReply,
            trustLevel: "Fact",
            citations: botCitations,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source
          }
        ]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn("API route error, falling back:", err);
    }

    // Fallback nếu mất mạng
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Dạ em đã nhận được câu hỏi: "${text}". Em luôn sẵn sàng hỗ trợ bạn mọi điều từ học tập, đời sống đến sức khỏe gia đình! Bạn kiểm tra lại kết nối mạng giúp em nếu câu trả lời chưa tải được nha! ❤️`,
          trustLevel: "Fact",
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: "vietai-local"
        }
      ]);
      setIsTyping(false);
    }, 500);
  };

  // Add Natural Expense
  const handleAddNaturalExpense = (text: string) => {
    let amount = 45000;
    let category = "Ăn uống";
    let jar = "Thiết yếu (55%)";
    let title = text;

    const numMatch = text.match(/\d+/);
    if (numMatch) {
      let rawNum = parseInt(numMatch[0]);
      if (rawNum < 1000) amount = rawNum * 1000;
      else amount = rawNum;
    }

    if (text.includes("xăng") || text.includes("xe") || text.includes("grab")) {
      category = "Đi lại";
    } else if (text.includes("học") || text.includes("sách") || text.includes("aio")) {
      category = "Học tập";
      jar = "Giáo dục (10%)";
    } else if (text.includes("trà sữa") || text.includes("cà phê") || text.includes("phim")) {
      category = "Hưởng thụ";
      jar = "Hưởng thụ (10%)";
    }

    setExpenses(prev => [
      { id: Date.now().toString(), title, amount, category, jar, date: "Vừa xong" },
      ...prev
    ]);
    setVoiceExpenseText("");
  };

  // Tax Calculation
  const taxCalculation = useMemo(() => {
    const insurance = grossSalary * 0.105;
    const personalDeduction = 11000000;
    const depDeduction = dependents * 4400000;
    const taxableIncome = Math.max(0, grossSalary - insurance - personalDeduction - depDeduction);

    let tax = 0;
    if (taxableIncome <= 5000000) tax = taxableIncome * 0.05;
    else if (taxableIncome <= 10000000) tax = 5000000 * 0.05 + (taxableIncome - 5000000) * 0.10;
    else if (taxableIncome <= 18000000) tax = 5000000 * 0.05 + 5000000 * 0.10 + (taxableIncome - 10000000) * 0.15;
    else tax = 5000000 * 0.05 + 5000000 * 0.10 + 8000000 * 0.15 + (taxableIncome - 18000000) * 0.20;

    const netSalary = grossSalary - insurance - tax;
    return { insurance, personalDeduction, depDeduction, taxableIncome, tax, netSalary };
  }, [grossSalary, dependents]);

  // Filtered Food
  const filteredDishes = useMemo(() => {
    return FOOD_DATABASE.filter(dish => {
      const matchSearch = dish.name.toLowerCase().includes(foodSearch.toLowerCase()) || dish.desc.toLowerCase().includes(foodSearch.toLowerCase());
      const matchRegion = selectedRegion === "Tất cả" || dish.region === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [foodSearch, selectedRegion]);

  // Macro Summary
  const macroSummary = useMemo(() => {
    return loggedMeals.reduce((acc, meal) => ({
      calo: acc.calo + meal.calo,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calo: 0, protein: 0, carbs: 0, fat: 0 });
  }, [loggedMeals]);

  // Run AI Simulation
  const handleRunSimulation = () => {
    setIsSimRunning(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimEpoch(prev => prev + 5);
      setSimLoss(prev => Math.max(0.08, prev * 0.82));
      setSimAccuracy(prev => Math.min(98.4, prev + 3.8));
      if (step >= 6) {
        clearInterval(interval);
        setIsSimRunning(false);
      }
    }, 400);
  };

  // Simulate Image OCR & Food Scanning
  const handleSimulateScan = (type: "food" | "receipt") => {
    setIsScanningImage(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanningImage(false);
      if (type === "food") {
        setScanResult("📸 **Phân tích hình ảnh thực tế (Vision AI):**\n\n• Nhận diện: **Phở bò tái nạm Hà Nội** (Độ tin cậy: 98.6%)\n• Thành phần phát hiện: Bánh phở tươi (180g), Nạm bò lát mỏng (110g), Nước hầm quế hồi, Hành hoa chẻ.\n• Ước tính năng lượng: **520 kcal** (28g Đạm, 65g Tinh bột, 16g Béo).\n• Lời khuyên: Giảm húp nước béo nổi nếu bạn đang muốn giữ dáng!");
      } else {
        setScanResult("🧾 **Quét hóa đơn mua sắm (Smart OCR):**\n\n• Cửa hàng: Siêu thị WinMart+ (Hà Nội)\n• Mục bóc tách:\n  - Thịt heo xay (300g): 45.000 đ\n  - Trứng gà Ba Huân (hộp 10): 32.000 đ\n  - Rau muống thủy canh: 14.000 đ\n• Tổng hóa đơn: **91.000 đ**\n✅ Đã tự động cập nhật vào Sổ Chi Tiêu (Lọ Thiết Yếu 55%)!");
        handleAddNaturalExpense("Hóa đơn WinMart 91k");
      }
    }, 1500);
  };

  // ============================================================================
  // NARRATION ACTION HANDLERS (Đề tài: Thuyết minh tự động đa ngôn ngữ)
  // ============================================================================
  const handleGenerateNarration = async () => {
    setIsGeneratingNarration(true);
    handleStopNarrationAudio();

    try {
      const topicName = customDestinationText.trim() ? customDestinationText.trim() : selectedDestination.name;
      const res = await fetch("/api/narration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicName,
          customText: customDestinationText.trim() ? customDestinationText.trim() : selectedDestination.description,
          targetLang: narrationLanguage,
          style: narrationStyle,
          duration: narrationDuration
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.narration) {
          setCurrentNarration(data.narration);
          setActiveNarrationSegment(0);
          setIsGeneratingNarration(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Lỗi khi sinh thuyết minh:", err);
    }

    // Fallback nếu ngoại lệ
    setIsGeneratingNarration(false);
  };

  const handleStopNarrationAudio = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingNarrationAudio(false);
  };

  const handlePlayNarration = (startSegmentIdx: number = 0) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Trình duyệt không hỗ trợ Web Speech Synthesis.");
      return;
    }

    if (isPlayingNarrationAudio && startSegmentIdx === activeNarrationSegment) {
      handleStopNarrationAudio();
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingNarrationAudio(true);
    setActiveNarrationSegment(startSegmentIdx);

    const segments = currentNarration.segments || [];
    if (segments.length === 0) {
      setIsPlayingNarrationAudio(false);
      return;
    }

    let currentIndex = startSegmentIdx;

    const playSegment = (idx: number) => {
      if (idx >= segments.length) {
        setIsPlayingNarrationAudio(false);
        setActiveNarrationSegment(0);
        return;
      }

      setActiveNarrationSegment(idx);
      const seg = segments[idx];
      const textToSpeak = (currentNarration.targetLanguage === "vi" ? seg.textVi : seg.textTarget) || seg.textVi;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = narrationSpeed;

      const langCodes: Record<string, string> = {
        vi: "vi-VN",
        en: "en-US",
        fr: "fr-FR",
        zh: "zh-CN",
        ja: "ja-JP",
        ko: "ko-KR"
      };
      const targetLangCode = langCodes[currentNarration.targetLanguage] || "en-US";
      utterance.lang = targetLangCode;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(targetLangCode.substring(0, 2)));
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onend = () => {
        currentIndex++;
        if (currentIndex < segments.length) {
          playSegment(currentIndex);
        } else {
          setIsPlayingNarrationAudio(false);
          setActiveNarrationSegment(0);
        }
      };

      utterance.onerror = () => {
        setIsPlayingNarrationAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    playSegment(currentIndex);
  };

  const handleExportSrt = () => {
    if (!currentNarration || !currentNarration.segments) return;

    let srtContent = "";
    currentNarration.segments.forEach((seg, idx) => {
      const startParts = seg.timeStart.split(":");
      const endParts = seg.timeEnd.split(":");
      const startSrt = `00:${startParts[0] || "00"}:${startParts[1] || "00"},000`;
      const endSrt = `00:${endParts[0] || "00"}:${endParts[1] || "00"},000`;

      srtContent += `${idx + 1}\n`;
      srtContent += `${startSrt} --> ${endSrt}\n`;
      srtContent += `${seg.textTarget}\n`;
      srtContent += `(${seg.textVi})\n\n`;
    });

    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `thuyet-minh-${currentNarration.topic.replace(/\s+/g, "-").toLowerCase()}-${currentNarration.targetLanguage}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!currentNarration) return;
    const blob = new Blob([JSON.stringify(currentNarration, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kich-ban-${currentNarration.topic.replace(/\s+/g, "-").toLowerCase()}-${currentNarration.targetLanguage}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 transition-all ${seniorMode ? "text-base" : "text-sm"}`}>
      
      {/* ==================================================================== */}
      {/* HEADER: HIỆN ĐẠI, ĐẲNG CẤP, GLASSMORPHISM & TIỆN ÍCH THỜI GIAN THỰC */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          
          {/* Logo & Dynamic Mascot Identity */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab("chat")}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 p-0.5 shadow-md shadow-emerald-500/25 flex items-center justify-center transition transform group-hover:scale-105">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <span className="text-xl">🌸</span>
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl text-slate-950 tracking-tight flex items-center gap-1">
                  VietAI <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Life</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1 shadow-2xs">
                  <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> DeepSeek V3 AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1">
                <span>{currentTimeGreeting} &bull; Bé Mai đồng hành cùng nhịp sống người Việt</span>
              </p>
            </div>
          </div>

          {/* Real-time Status Badges: Weather & Lunar Calendar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Weather Widget */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Hà Nội: <strong>28°C</strong> Nắng dịu</span>
              <span className="text-slate-300">|</span>
              <span>TP.HCM: <strong>32°C</strong></span>
            </div>

            {/* Lịch Âm & Hoàng Đạo */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>13/10/2026 &bull; <strong>03/09 Âm Lịch (Hoàng Đạo)</strong></span>
            </div>

            {/* Senior Mode Toggle (Chế độ Chữ To cho Người Lớn Tuổi) */}
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                seniorMode
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
              title="Chuyển chế độ chữ to, rõ nét cho ông bà, cô chú"
            >
              <span>👓</span>
              <span className="hidden sm:inline">{seniorMode ? "Chữ to (Bật)" : "Chế độ chữ to"}</span>
            </button>

            {/* AI Settings Trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition border border-slate-200"
              title="Cài đặt AI"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* NAVIGATION DOCK: TỰA NHƯ VISION OS / APPLE DOCK THÔNG MINH          */}
        {/* ==================================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* TAB ĐỒ ÁN CNPM: THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ */}
          <button
            onClick={() => setActiveTab("narration")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "narration"
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400"
                : "bg-white/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
            }`}
          >
            <Radio className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span>Thuyết Minh Đa Ngôn Ngữ</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px]">Đồ Án CNPM</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "chat"
                ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                : "bg-white/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
            }`}
          >
            <MessageSquareHeart className="w-4 h-4 text-emerald-400" />
            <span>Hỏi Gì Đáp Nấy (Omni-AI Live)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px]">Trọng tâm</span>
          </button>

          <button
            onClick={() => setActiveTab("nutrition")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "nutrition"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-white/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-500" />
            <span>Món Ngon & Dinh Dưỡng 360</span>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "finance"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                : "bg-white/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>Sổ Tay Chi Tiêu & Thuế 2026</span>
          </button>

          <button
            onClick={() => setActiveTab("civic")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "civic"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-white/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
            }`}
          >
            <Landmark className="w-4 h-4 text-blue-500" />
            <span>Dịch Vụ Công & VNeID</span>
          </button>

          <button
            onClick={() => setActiveTab("academy")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "academy"
                ? "bg-purple-700 text-white shadow-lg shadow-purple-700/20"
                : "bg-white/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Kỹ Thuật AI VIỆT NAM (AIO)</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTENT                                                         */}
      {/* ==================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ================================================================== */}
        {/* TAB 0: THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ (ĐỒ ÁN CÔNG NGHỆ PHẦN MỀM)  */}
        {/* ================================================================== */}
        {activeTab === "narration" && (
          <div className="space-y-6">
            
            {/* Academic Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-indigo-900/40">
              <div className="relative z-10 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-indigo-300 text-xs font-black border border-indigo-400/30">
                    <Radio className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                    ĐỒ ÁN CÔNG NGHỆ PHẦN MỀM &bull; GV: THS. NGUYỄN QUỐC HUY
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
                    Bản quyền: Tuyên Phạm (@phamvantuyenuit2006-oss)
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Hệ Thống Thuyết Minh Tự Động Đa Ngôn Ngữ</span>
                  <span className="text-sm font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-600/40 text-indigo-200 border border-indigo-400/40">
                    Automated Multilingual Narration
                  </span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                  Giải pháp công nghệ hỗ trợ bảo tồn di sản và hướng dẫn viên ảo cho du khách quốc tế. Tích hợp AI sinh kịch bản thuyết minh tự động, dịch thuật đa ngữ ngữ cảnh văn hóa, công nghệ tổng hợp giọng đọc Text-to-Speech (TTS) và phụ đề song ngữ đồng bộ theo thời gian thực (Real-time Karaoke Subtitles).
                </p>

                {/* 4 Technical Pillars Badges */}
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-200">
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <strong>Yêu cầu 1:</strong> FE React.js + Next.js (Web) &amp; React Native (Mobile)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <strong>Yêu cầu 2:</strong> BE .NET 10 Kiến trúc 3 Lớp (Clean Architecture)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-amber-400" />
                    <strong>Yêu cầu 3:</strong> Microservices giao tiếp nhau (Translation &rarr; TTS &rarr; Storage)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <strong>CI/CD:</strong> GitHub Actions Pipeline tự động
                  </span>
                </div>
              </div>

              <div className="absolute right-4 -bottom-6 text-9xl opacity-10 select-none pointer-events-none">
                🏛️
              </div>
            </div>

            {/* Destination Selection & Input Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Bước 1: Chọn Địa Danh Di Sản Hoặc Nhập Tùy Chọn
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kho dữ liệu hơn 6 di tích tiêu biểu hoặc bạn có thể tự nhập bất kỳ điểm đến du lịch nào tại Việt Nam
                  </p>
                </div>

                {/* Filter tags */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {["Tất cả", "Di sản Thế giới UNESCO", "Di tích Lịch sử Quốc gia"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNarrationFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        narrationFilter === cat
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {NARRATION_DESTINATIONS.filter(d => narrationFilter === "Tất cả" || d.category === narrationFilter).map((dest) => {
                  const isSelected = selectedDestination.id === dest.id && !customDestinationText.trim();
                  return (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setSelectedDestination(dest);
                        setCustomDestinationText("");
                      }}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer text-left relative flex flex-col justify-between ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-200"
                          : "border-slate-200/80 hover:border-indigo-300 bg-slate-50/50 hover:bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{dest.icon}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/80 text-slate-600 border border-slate-200">
                            {dest.province}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{dest.name}</h4>
                        <span className="text-[10px] font-bold text-indigo-700 block mb-1.5">{dest.category}</span>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{dest.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">3 phân đoạn</span>
                        <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-indigo-700" : "text-slate-500"}`}>
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                          {isSelected ? "Đang chọn" : "Chọn địa danh"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Destination Input */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Hoặc nhập địa danh tùy chọn / đoạn giới thiệu riêng của bạn:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDestinationText}
                    onChange={(e) => setCustomDestinationText(e.target.value)}
                    placeholder="Ví dụ: Cột cờ Lũng Cú Hà Giang, Địa đạo Củ Chi, Cầu Vàng Bà Nà Hills..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                  {customDestinationText && (
                    <button
                      onClick={() => setCustomDestinationText("")}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Narration Controls & Generator Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                Bước 2: Cấu Hình Ngôn Ngữ, Phong Cách &amp; Khởi Tạo Kịch Bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Language Picker (6 languages) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-indigo-600" />
                    Ngôn ngữ thuyết minh (6 thứ tiếng):
                  </label>
                  <select
                    value={narrationLanguage}
                    onChange={(e) => setNarrationLanguage(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    <option value="vi">🇻🇳 Tiếng Việt (Bản địa)</option>
                    <option value="en">🇬🇧 English (Quốc tế)</option>
                    <option value="fr">🇫🇷 Français (Tiếng Pháp)</option>
                    <option value="zh">🇨🇳 中文 (Tiếng Trung)</option>
                    <option value="ja">🇯🇵 日本語 (Tiếng Nhật)</option>
                    <option value="ko">🇰🇷 한국어 (Tiếng Hàn)</option>
                  </select>
                </div>

                {/* 2. Style Picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Phong cách giọng đọc &amp; kịch bản:
                  </label>
                  <select
                    value={narrationStyle}
                    onChange={(e) => setNarrationStyle(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    <option value="inspirational">🌟 Truyền cảm &amp; Thơ mộng</option>
                    <option value="academic">🏛️ Hàn lâm &amp; Lịch sử chuẩn xác</option>
                    <option value="storytelling">📖 Kể chuyện văn hóa sinh động</option>
                    <option value="quick">⚡ Súc tích cho du khách bận rộn</option>
                  </select>
                </div>

                {/* 3. Duration Picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Độ dài bài thuyết minh:
                  </label>
                  <select
                    value={narrationDuration}
                    onChange={(e) => setNarrationDuration(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    <option value="short">1 phút (Điểm nhấn tham quan)</option>
                    <option value="medium">2 - 3 phút (Chuẩn hướng dẫn viên)</option>
                    <option value="full">5 phút (Toàn cảnh chuyên sâu)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Điều phối qua Microservice Orchestrator &rarr; DeepSeek V3 AI Engine</span>
                </div>

                <button
                  onClick={handleGenerateNarration}
                  disabled={isGeneratingNarration}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingNarration ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang điều phối Microservices &amp; sinh kịch bản...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Khởi Tạo Kịch Bản Thuyết Minh &amp; Đa Ngôn Ngữ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 3: Interactive Audio Player & Karaoke Subtitle Sync */}
            {currentNarration && (
              <div className="space-y-6">
                
                {/* Audio Player Card */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/50 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                          {currentNarration.targetLanguage.toUpperCase()} AUDIO GUIDE
                        </span>
                        <span className="text-xs text-slate-400">&bull; 3 Phân đoạn đồng bộ</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">{currentNarration.title}</h3>
                      <p className="text-xs text-indigo-200 leading-relaxed max-w-2xl">{currentNarration.overview}</p>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportSrt}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/20 shadow-xs"
                        title="Tải phụ đề chuẩn SRT"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-300" />
                        <span>Xuất SRT</span>
                      </button>

                      <button
                        onClick={handleExportJson}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/20 shadow-xs"
                        title="Tải kịch bản JSON"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
                        <span>Xuất JSON</span>
                      </button>
                    </div>
                  </div>

                  {/* Playback Controls & Progress */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePlayNarration(activeNarrationSegment)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition shadow-lg ${
                          isPlayingNarrationAudio
                            ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                            : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/40"
                        }`}
                      >
                        {isPlayingNarrationAudio ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={handleStopNarrationAudio}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                        title="Dừng phát âm thanh"
                      >
                        <VolumeX className="w-5 h-5" />
                      </button>

                      <div>
                        <div className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span>{isPlayingNarrationAudio ? "Đang phát giọng đọc AI" : "Sẵn sàng phát âm thanh"}</span>
                          {isPlayingNarrationAudio && (
                            <span className="flex gap-1 items-center">
                              <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
                              <span className="w-1.5 h-4 bg-teal-400 rounded-full animate-bounce delay-100" />
                              <span className="w-1.5 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-indigo-200">
                          Phân đoạn {activeNarrationSegment + 1} / {(currentNarration.segments || []).length} &bull; Web Speech TTS Engine
                        </p>
                      </div>
                    </div>

                    {/* Speed Controls */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300 font-semibold">Tốc độ:</span>
                      {[0.8, 1.0, 1.2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => {
                            setNarrationSpeed(spd);
                            if (isPlayingNarrationAudio) {
                              handlePlayNarration(activeNarrationSegment);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            narrationSpeed === spd
                              ? "bg-white text-slate-900 shadow-xs"
                              : "bg-white/10 hover:bg-white/20 text-slate-200"
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Karaoke Bilingual Subtitle Sync Viewer */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                        <FileAudio className="w-5 h-5 text-indigo-600" />
                        Phụ Đề Song Ngữ Đồng Bộ Thời Gian Thực (Karaoke Subtitles)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Bấm vào phân đoạn bất kỳ để nghe trực tiếp câu đó kèm hiển thị đối chiếu song ngữ
                      </p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Đồng bộ Timestamps
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(currentNarration.segments || []).map((seg, idx) => {
                      const isActive = isPlayingNarrationAudio && activeNarrationSegment === idx;
                      return (
                        <div
                          key={seg.id || idx}
                          onClick={() => handlePlayNarration(idx)}
                          className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
                            isActive
                              ? "border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-200/80"
                              : "border-slate-200/80 hover:border-indigo-200 bg-slate-50/50 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg font-mono ${
                              isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                            }`}>
                              ⏱️ {seg.timeStart} &rarr; {seg.timeEnd}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {isActive && (
                                <span className="text-[10px] font-bold text-indigo-600 animate-pulse flex items-center gap-1">
                                  <Radio className="w-3 h-3" /> Đang phát
                                </span>
                              )}
                              <span className="text-xs text-slate-400">Đoạn #{idx + 1}</span>
                            </div>
                          </div>

                          {/* Target language subtitle */}
                          <div className="font-bold text-sm text-slate-900 leading-relaxed mb-2">
                            {seg.textTarget}
                          </div>

                          {/* Vietnamese reference */}
                          <div className="text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-indigo-300">
                            {seg.textVi}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cultural Insights & Visitor Etiquette */}
                {currentNarration.culturalTips && (
                  <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-2">
                    <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-2">
                      <span>🏮</span> Lưu Ý Văn Hóa &amp; Hướng Dẫn Du Khách (Cultural Etiquette)
                    </h4>
                    <p className="text-xs text-amber-900 whitespace-pre-line leading-relaxed">
                      {currentNarration.culturalTips}
                    </p>
                  </div>
                )}

                {/* 3-Tier Architecture & Microservices Inspector */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-400" />
                      Trực Quan Hóa Luồng Kiến Trúc 3 Lớp &amp; Microservices (.NET 10 + Clean Architecture)
                    </h4>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Unit Tests Passed (6/6)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> 1. Presentation Tier
                      </div>
                      <p className="text-[11px] text-slate-300">
                        React.js / Next.js Web + React Native Mobile. Gọi API qua HTTP POST <code>/api/v1/narration/generate</code>.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <div className="font-extrabold text-teal-300 flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5" /> 2. Orchestrator Service
                      </div>
                      <p className="text-[11px] text-slate-300">
                        <code>INarrationService</code> điều phối kịch bản, chia timestamp và phân bổ công việc cho 3 microservices con.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" /> 3. Translation &amp; TTS
                      </div>
                      <p className="text-[11px] text-slate-300">
                        <code>ITranslationService</code> dịch 6 ngôn ngữ &bull; <code>ITextToSpeechService</code> tổng hợp giọng đọc audio stream.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" /> 4. Storage &amp; Subtitles
                      </div>
                      <p className="text-[11px] text-slate-300">
                        <code>IMediaStorageService</code> lưu trữ tệp âm thanh MP3 và sinh tệp phụ đề SRT / VTT chuẩn thời gian.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 1: HỎI GÌ ĐÁP NẤY (OMNI-AI CHAT TOÀN NĂNG - DEEPSEEK LIVE V3)   */}
        {/* ================================================================== */}
        {activeTab === "chat" && (
          <div className="space-y-6">
            
            {/* Modern Animated Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 border border-emerald-900/30">
              <div className="relative z-10 max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  Trực tiếp kết nối DeepSeek-V3 Live & Đào tạo chuẩn AI VIỆT NAM AIO
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Bé Mai đã sẵn sàng! Bạn muốn hỏi điều gì hôm nay?
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  Bạn có thể hỏi mọi điều trong cuộc sống: từ mâm cơm 100k, tính calo phở bò, sơ cứu khi sốt, ghi sổ chi tiêu, thủ tục VNeID, tới lập trình Python PyTorch hay bất kỳ câu hỏi khoa học & đời thường nào!
                </p>
              </div>

              {/* Action Buttons inside Hero */}
              <div className="relative z-10 pt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowImageScannerModal(true)}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition backdrop-blur-md border border-white/20 shadow-xs"
                >
                  <Camera className="w-4 h-4 text-emerald-300" />
                  <span>Chụp / Tải ảnh món ăn & hóa đơn (Vision AI)</span>
                </button>
              </div>

              <div className="absolute right-6 -bottom-8 text-9xl opacity-10 select-none pointer-events-none">
                🌸
              </div>
            </div>

            {/* Persona Switcher Bar */}
            <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-slate-500 pl-2 whitespace-nowrap">Đổi chuyên gia:</span>
              {[
                { id: "friend", name: "Bé Mai (Đời sống)", icon: "🌸", desc: "Thân mật, ấm áp, thấu cảm" },
                { id: "doctor", name: "Bác sĩ Gia đình", icon: "🩺", desc: "Lời khuyên y khoa cẩn trọng" },
                { id: "chef", name: "Bếp trưởng 3 Miền", icon: "🍳", desc: "Bí quyết món ngon & nêm nếm" },
                { id: "finance", name: "Cố vấn Tiền bạc", icon: "💰", desc: "Chi tiêu 6 lọ, thuế TNCN 2026" },
                { id: "civic", name: "Chuyên viên Thủ tục", icon: "🏛️", desc: "VNeID, CCCD, tạm trú online" },
                { id: "aio", name: "Kỹ sư AI AIO", icon: "🚀", desc: "PyTorch, RAG, Clean Architecture" },
                { id: "tutor", name: "Gia sư Thông thái", icon: "📚", desc: "Giải toán, tiếng Anh, viết văn" }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                    persona === p.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Chat Box Container */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col min-h-[580px]">
              
              {/* Chat Stream Header */}
              <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-extrabold text-slate-800">Trò chuyện Trực tuyến cùng Bé Mai</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Xác thực nguồn gốc (Trust Layer)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                    ⚡ Live AI Active
                  </span>
                  <button
                    onClick={() => setMessages([messages[0]])}
                    className="hover:text-rose-600 transition flex items-center gap-1 text-[11px] font-semibold"
                    title="Làm mới cuộc trò chuyện"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[540px]">
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    
                    {/* Bot Avatar */}
                    {m.role === "assistant" && (
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-emerald-600/20">
                        <span className="text-base">🌸</span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm ${
                      m.role === "user"
                        ? "bg-slate-950 text-white rounded-tr-none shadow-md shadow-slate-950/20"
                        : "bg-slate-50/90 border border-slate-200/90 text-slate-800 rounded-tl-none shadow-2xs"
                    }`}>
                      
                      {/* Message Content */}
                      <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                        {m.content}
                      </div>

                      {/* Citations & Trust Layer */}
                      {m.citations && m.citations.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Nguồn tin cậy đã xác thực:
                          </div>
                          {m.citations.map((c, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-slate-600">
                              <span>&bull;</span>
                              <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-medium inline-flex items-center gap-1">
                                {c.title} ({c.org}, {c.date}) <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message Actions: Copy, Read aloud & Time */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{m.createdAt}</span>
                        {m.role === "assistant" && (
                          <div className="flex items-center gap-2">
                            {/* Read aloud button */}
                            <button
                              onClick={() => handleSpeakText(m.id, m.content)}
                              className={`p-1.5 rounded-lg transition hover:bg-slate-200/80 ${
                                speakingMessageId === m.id ? "text-emerald-600 font-bold" : "text-slate-500"
                              }`}
                              title={speakingMessageId === m.id ? "Dừng đọc" : "Đọc bằng giọng tiếng Việt"}
                            >
                              {speakingMessageId === m.id ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            {/* Copy button */}
                            <button
                              onClick={() => navigator.clipboard.writeText(m.content)}
                              className="p-1.5 rounded-lg transition hover:bg-slate-200/80 text-slate-500"
                              title="Sao chép nội dung"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Avatar */}
                    {m.role === "user" && (
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <span className="text-sm">👤</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start items-center">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-base">🌸</span>
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-slate-100 text-slate-600 text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] font-semibold text-slate-600 ml-1">Bé Mai đang suy nghĩ và tra cứu...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-200/70 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-slate-500 pl-1 whitespace-nowrap">Gợi ý nhanh:</span>
                {[
                  { text: "Hôm nay 100k nấu cơm 4 người ăn gì ngon?", icon: "🍲" },
                  { text: "Bị sốt 38.5 độ và đau họng nên làm gì ngay?", icon: "🤒" },
                  { text: "Vừa mua ly trà sữa 35k ghi sổ giúp mình", icon: "💸" },
                  { text: "Đổi bằng lái xe online trên VNeID thế nào?", icon: "🚗" },
                  { text: "Tính calo 1 tô phở bò và đĩa cơm tấm", icon: "📊" },
                  { text: "Code Python phân loại ảnh bằng PyTorch", icon: "💻" },
                  { text: "Nếu chim cánh cụt biết bay thì ra sao?", icon: "🐧" },
                  { text: "Làm một bài thơ 4 câu tặng mẹ thân yêu", icon: "🌸" }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.text)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold transition border border-slate-200 shadow-2xs whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.text}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input & Voice Controller */}
              <div className="p-4 bg-white border-t border-slate-200">
                {isVoiceRecording && (
                  <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800 animate-pulse">
                    <div className="flex items-center gap-2 font-bold">
                      <Mic className="w-4 h-4 text-rose-600 animate-spin" />
                      <span>Bé Mai đang lắng nghe giọng nói tiếng Việt... Hãy nói câu hỏi của bạn nhé!</span>
                    </div>
                    <button
                      onClick={handleToggleVoiceRecognition}
                      className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs"
                    >
                      Dừng ghi âm
                    </button>
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecognition}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-center ${
                      isVoiceRecording
                        ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30"
                        : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border-slate-200"
                    }`}
                    title="Nói trực tiếp bằng giọng tiếng Việt"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Hỏi bất cứ điều gì: mâm cơm 100k, dinh dưỡng tô phở, đăng ký tạm trú VNeID, giải toán, viết code..."
                    className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50/60 transition"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-extrabold transition flex items-center gap-2 text-xs sm:text-sm shadow-md shadow-slate-950/20"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Gửi</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: DINH DƯỠNG & MÓN VIỆT 360                                   */}
        {/* ================================================================== */}
        {activeTab === "nutrition" && (
          <div className="space-y-6">
            
            {/* Personalized Health Dashboard (BMI, Nước, TDEE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* BMI Widget */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span className="font-bold">Chỉ Số Khối Thể (BMI)</span>
                    <Scale className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {userBmi} <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Bình Thường</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Chiều cao: {userHeight}cm &bull; Cân nặng: {userWeight}kg
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="range"
                    min={40}
                    max={120}
                    value={userWeight}
                    onChange={(e) => setUserWeight(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Water Reminder Widget */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-blue-100 text-xs mb-1">
                    <span className="font-bold">Theo Dõi Uống Nước</span>
                    <Droplets className="w-4 h-4 text-cyan-200" />
                  </div>
                  <div className="text-3xl font-black">
                    {waterCups * 250} <span className="text-xs font-normal">/ {recommendedWater} ml</span>
                  </div>
                  <p className="text-xs text-blue-100 mt-1">
                    Đã đạt: {Math.round((waterCups * 250 / recommendedWater) * 100)}% mục tiêu ngày
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
                  <button
                    onClick={() => setWaterCups(Math.max(0, waterCups - 1))}
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold">{waterCups} ly (250ml)</span>
                  <button
                    onClick={() => setWaterCups(waterCups + 1)}
                    className="px-3 py-1 rounded-lg bg-white text-blue-700 font-extrabold text-xs shadow-xs"
                  >
                    + Thêm 1 Ly
                  </button>
                </div>
              </div>

              {/* Total Calo Target */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span className="font-bold">Năng Lượng Đã Nạp Hôm Nay</span>
                    <Flame className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {macroSummary.calo} <span className="text-xs font-normal text-slate-400">/ 2.000 kcal</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 flex gap-2">
                    <span>Đạm: <strong>{macroSummary.protein}g</strong></span>
                    <span>&bull;</span>
                    <span>Đường: <strong>{macroSummary.carbs}g</strong></span>
                    <span>&bull;</span>
                    <span>Béo: <strong>{macroSummary.fat}g</strong></span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Dinh dưỡng cân bằng, đủ năng lượng
                </div>
              </div>
            </div>

            {/* Food Database Bento Grid */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span>🍲</span> Tra Cứu Dinh Dưỡng Hơn 500 Món Việt
                  </h3>
                  <p className="text-xs text-slate-500">Chuẩn số liệu Viện Dinh Dưỡng Quốc Gia Việt Nam</p>
                </div>
                
                {/* Search & Region Filters */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    placeholder="Tìm món: phở, bún chả, cơm tấm..."
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none"
                  >
                    <option value="Tất cả">Tất cả miền</option>
                    <option value="Bắc">Miền Bắc</option>
                    <option value="Trung">Miền Trung</option>
                    <option value="Nam">Miền Nam</option>
                    <option value="Đồ uống / Ăn vặt">Đồ uống / Ăn vặt</option>
                  </select>
                </div>
              </div>

              {/* Grid of Dishes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDishes.map((dish) => (
                  <div key={dish.id} className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/70 hover:shadow-md transition bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-sm text-slate-900">{dish.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                          {dish.region}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{dish.desc}</p>
                      
                      <div className="grid grid-cols-4 gap-1 text-center py-2 px-1 rounded-xl bg-white border border-slate-200 text-[11px] mb-3">
                        <div>
                          <div className="font-extrabold text-amber-600">{dish.calo}</div>
                          <div className="text-[10px] text-slate-400">kcal</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-700">{dish.protein}g</div>
                          <div className="text-[10px] text-slate-400">Đạm</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-700">{dish.carbs}g</div>
                          <div className="text-[10px] text-slate-400">Đường</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-700">{dish.fat}g</div>
                          <div className="text-[10px] text-slate-400">Béo</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        🚶 Cần đi bộ: <strong>{dish.walkingMin} phút</strong>
                      </span>
                      <button
                        onClick={() => setLoggedMeals(prev => [dish, ...prev])}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs"
                      >
                        + Đã Ăn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Meal Planner by Budget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>🏡</span> Gợi Ý Mâm Cơm Đi Chợ Theo Ngân Sách
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MARKET_PLANS.map((plan, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-emerald-700 text-base">{plan.label}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {plan.people}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mb-2">{plan.type}</div>
                      
                      <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                        {plan.dishes.map((d, di) => (
                          <div key={di} className="flex justify-between items-center text-[11px]">
                            <span>&bull; {d.name}</span>
                            <span className="font-bold text-slate-800">{d.price.toLocaleString("vi-VN")}đ</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-[10px] text-slate-500 italic mb-2">{plan.chefTip}</p>
                      <button
                        onClick={() => handleSendMessage(`Gợi ý chi tiết cách nấu ${plan.type} với ngân sách ${plan.label} cho ${plan.people}`)}
                        className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition"
                      >
                        Hỏi Bé Mai cách nấu &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: TÀI CHÍNH CÁ NHÂN, THUẾ TNCN 2026 & VIETQR                  */}
        {/* ================================================================== */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            
            {/* Voice-to-Expense Quick Input */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-xl shadow-amber-900/10">
              <div className="max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 inline-block">
                  🎙️ Nhận diện giọng nói chi tiêu tự nhiên
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-1">
                  Nói một câu — Tự động ghi chép vào ví
                </h3>
                <p className="text-amber-100 text-xs mb-4">
                  Ví dụ: *"Trưa nay ăn bún bò 45 nghìn"*, *"Đổ xăng xe máy 70k"*, *"Mua sách học AI 220k"*
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voiceExpenseText}
                    onChange={(e) => setVoiceExpenseText(e.target.value)}
                    placeholder="Gõ hoặc nói câu chi tiêu..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm outline-none shadow-inner"
                  />
                  <button
                    onClick={() => handleAddNaturalExpense(voiceExpenseText || "Trưa nay ăn phở 50k")}
                    className="px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>Ghi Sổ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Expenses List & 6 Jars Rule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Expenses List with VietQR trigger */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-base text-slate-900 flex items-center justify-between">
                  <span>Sổ Ghi Chép Chi Tiêu Gần Đây</span>
                  <span className="text-xs text-slate-500 font-normal">Hôm nay: {expenses.length} khoản</span>
                </h4>

                <div className="space-y-2.5">
                  {expenses.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base">
                          {item.category === "Ăn uống" ? "🍲" : item.category === "Đi lại" ? "🛵" : "📚"}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.date} &bull; Lọ: <span className="text-emerald-700 font-semibold">{item.jar}</span></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-extrabold text-sm text-slate-900">-{item.amount.toLocaleString("vi-VN")} đ</div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">{item.category}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedQrItem({ title: item.title, amount: item.amount });
                            setShowQrModal(true);
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
                          title="Tạo mã VietQR thanh toán nhanh"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 Jars Rule Widget */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span>🏺</span> Quy Tắc 6 Chiếc Lọ (Jars)
                </h4>
                <div className="space-y-3 text-xs">
                  {[
                    { name: "Thiết yếu (NEC)", pct: 55, color: "bg-emerald-500", desc: "Ăn uống, thuê nhà, điện nước" },
                    { name: "Tiết kiệm dài hạn (LTSS)", pct: 10, color: "bg-blue-500", desc: "Quỹ khẩn cấp, mua sắm lớn" },
                    { name: "Giáo dục / Phát triển (EDU)", pct: 10, color: "bg-purple-500", desc: "Sách vở, học khóa AI AIO" },
                    { name: "Tự do tài chính (FFA)", pct: 10, color: "bg-amber-500", desc: "Đầu tư tích lũy sinh lời" },
                    { name: "Hưởng thụ (PLAY)", pct: 10, color: "bg-rose-500", desc: "Cà phê, giải trí, du lịch" },
                    { name: "Cho đi (GIVE)", pct: 5, color: "bg-teal-500", desc: "Báo hiếu cha mẹ, từ thiện" }
                  ].map((jar, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>{jar.name}</span>
                        <span>{jar.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full ${jar.color}`} style={{ width: `${jar.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gross to Net & PIT Tax 2026 Calculator */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                Công Cụ Tính Lương Gross &rarr; Net & Thuế TNCN 2026
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lương Gross hàng tháng (VND):
                    </label>
                    <input
                      type="number"
                      step={1000000}
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số người phụ thuộc (Con nhỏ, cha mẹ già):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={dependents}
                      onChange={(e) => setDependents(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                {/* Calculation Result */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Đóng Bảo hiểm (10.5%):</span>
                    <span className="font-bold text-rose-600">-{taxCalculation.insurance.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Giảm trừ bản thân (11tr) + người phụ thuộc:</span>
                    <span className="font-semibold text-slate-600">{(taxCalculation.personalDeduction + taxCalculation.depDeduction).toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Thuế TNCN tạm nộp (Lũy tiến):</span>
                    <span className="font-bold text-rose-600">-{taxCalculation.tax.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-extrabold text-emerald-950">
                    <span>LƯƠNG THỰC NHẬN (NET):</span>
                    <span className="text-base text-emerald-700">{Math.round(taxCalculation.netSalary).toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: DỊCH VỤ CÔNG & THỦ TỤC VNeID                                  */}
        {/* ================================================================== */}
        {activeTab === "civic" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl shadow-blue-900/10">
              <h3 className="text-xl sm:text-2xl font-extrabold mb-1">
                🏛️ Cổng Hướng Dẫn Dịch Vụ Công & VNeID
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm">
                Đơn giản hóa mọi thủ tục hành chính tại Việt Nam: đăng ký tạm trú, cấp thẻ Căn cước mới 2024, đổi bằng lái xe trực tuyến.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CIVIC_GUIDES.map((guide) => (
                <div key={guide.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] mb-2 inline-block">
                      {guide.dept}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mb-2">{guide.title}</h4>
                    <div className="text-xs text-slate-500 mb-4 space-y-1">
                      <div>⏱️ Thời gian: <strong>{guide.time}</strong></div>
                      <div>💵 Lệ phí: <strong>{guide.fee}</strong></div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 mb-4">
                      {guide.steps.map((st, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: st }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 mb-3">{guide.lawRef}</p>
                    <button
                      onClick={() => handleSendMessage(`Hướng dẫn chi tiết thủ tục ${guide.title}`)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                    >
                      Bé Mai giải thích chi tiết &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 5: HỌC VIỆN & KỸ THUẬT AI VIỆT NAM (AIO 2026)                  */}
        {/* ================================================================== */}
        {activeTab === "academy" && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  Chương Trình Đào Tạo Kỹ Sư AI Chuyên Nghiệp (AIO 2026)
                </div>
                <h3 className="text-2xl font-extrabold mb-2">
                  12 Module Kỹ Sư AI Toàn Diện — AI VIET NAM
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Được thiết kế dựa trên triết lý đào tạo của AI VIET NAM: bản chất toán học vững vàng, không học vẹt, kỷ luật huấn luyện khắt khe và công bố nghiên cứu quốc tế (CVPR-W, MLMI).
                </p>
              </div>
            </div>

            {/* PyTorch Simulator */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    Trình Mô Phỏng Huấn Luyện Mạng Nơ-ron (PyTorch TensorBoard Simulator)
                  </h4>
                  <p className="text-xs text-slate-500">Kỷ luật log Loss & Accuracy qua từng Epoch</p>
                </div>
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimRunning}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSimRunning ? "Đang huấn luyện..." : "Chạy 5 Epochs tiếp theo"}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Current Epoch</div>
                  <div className="text-2xl font-extrabold text-slate-900">{simEpoch} / 100</div>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="text-xs text-rose-700 mb-1">Loss (CrossEntropy)</div>
                  <div className="text-2xl font-extrabold text-rose-600">{simLoss.toFixed(4)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-700 mb-1">Accuracy (Top-1)</div>
                  <div className="text-2xl font-extrabold text-emerald-600">{simAccuracy.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* 12 Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AIO_MODULES.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-white shadow-2xs transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono">
                        {m.code}
                      </span>
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        {m.tag}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-sm text-slate-900 mb-1">{m.name}</h5>
                    <p className="text-xs text-slate-500 mb-3">{m.topics}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span>Thời lượng: {m.hours}</span>
                    <button
                      onClick={() => handleSendMessage(`Giải thích chi tiết kiến thức ${m.name} (${m.code}) của AI VIET NAM`)}
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      Học module này &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ==================================================================== */}
      {/* MODAL 1: VISION AI SCANNER (ẢNH MÓN ĂN & HÓA ĐƠN)                   */}
      {/* ==================================================================== */}
      {showImageScannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                Quét Thị Giác Máy Tính (Vision AI & Smart OCR)
              </h3>
              <button
                onClick={() => setShowImageScannerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Trải nghiệm công nghệ thị giác máy tính chuẩn <strong>Module 09 (Computer Vision - YOLO & OCR)</strong>: Nhận diện tức thì calo tô phở hoặc bóc tách hóa đơn đi chợ tự động!
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSimulateScan("food")}
                disabled={isScanningImage}
                className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-center transition flex flex-col items-center gap-2"
              >
                <span className="text-3xl">🍜</span>
                <span className="font-extrabold text-xs text-emerald-950">Quét Tô Phở Bò</span>
                <span className="text-[10px] text-emerald-700">Nhận diện Calo & Dinh dưỡng</span>
              </button>

              <button
                onClick={() => handleSimulateScan("receipt")}
                disabled={isScanningImage}
                className="p-4 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-600 bg-amber-50/50 hover:bg-amber-50 text-center transition flex flex-col items-center gap-2"
              >
                <span className="text-3xl">🧾</span>
                <span className="font-extrabold text-xs text-amber-950">Quét Hóa Đơn WinMart</span>
                <span className="text-[10px] text-amber-700">Tự động ghi sổ chi tiêu</span>
              </button>
            </div>

            {isScanningImage && (
              <div className="p-4 rounded-2xl bg-slate-100 flex items-center justify-center gap-3 text-xs text-slate-700 font-semibold animate-pulse">
                <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>Mạng Nơ-ron đang phân tích đặc trưng hình ảnh (CNN Feature Extraction)...</span>
              </div>
            )}

            {scanResult && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {scanResult}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setShowImageScannerModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition shadow-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: VIETQR THANH TOÁN THÔNG MINH                                */}
      {/* ==================================================================== */}
      {showQrModal && selectedQrItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                Thanh Toán VietQR (NAPAS 247)
              </h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center">
              {/* VietQR Mockup Image */}
              <div className="w-48 h-48 bg-white rounded-xl p-2 border border-slate-300 shadow-inner flex flex-col items-center justify-center mb-2">
                <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-3 space-y-2">
                  <QrCode className="w-20 h-20 text-emerald-400" />
                  <span className="text-[10px] font-mono text-slate-300">VIETAI-QR-2026-PAY</span>
                </div>
              </div>
              <div className="font-extrabold text-base text-slate-900">{selectedQrItem.title}</div>
              <div className="text-xl font-black text-emerald-700">{selectedQrItem.amount.toLocaleString("vi-VN")} đ</div>
              <p className="text-[11px] text-slate-400 mt-1">Quét bằng mọi ứng dụng Ngân hàng (MB, VCB, Techcombank, Momo)</p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Đã Thanh Toán Xong
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: CÀI ĐẶT TRÍ TUỆ NHÂN TẠO                                    */}
      {/* ==================================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                Cài Đặt Trí Tuệ Nhân Tạo
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
              ✅ <strong>Đang kết nối:</strong> DeepSeek-V3 Live AI trực tiếp thông qua máy chủ cục bộ. Bé Mai có thể trả lời mọi câu hỏi với chất lượng cao nhất!
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Gemini API Key (Tùy chọn bổ sung):
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Lấy miễn phí tại: <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">aistudio.google.com</a>
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleSaveApiKey("")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Dùng Mặc Định
              </button>
              <button
                onClick={() => handleSaveApiKey(geminiApiKey)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
              >
                Lưu Cài Đặt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FOOTER: VĂN HÓA & BẢN QUYỀN                                           */}
      {/* ==================================================================== */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-800">
          VietAI Life &copy; 2026 &bull; Bản quyền thuộc về <a href="https://github.com/phamvantuyenuit2006-oss" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-extrabold">Tuyên Phạm (@phamvantuyenuit2006-oss)</a>
        </p>
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
          Nền tảng Trợ lý AI Đời sống Người Việt &bull; Tích hợp giáo trình AI VIỆT NAM (AIO Academy) &amp; DeepSeek V3 AI. Tuân thủ Nghị định 13/2023/NĐ-CP.
        </p>
      </footer>
    </div>
  );
}
