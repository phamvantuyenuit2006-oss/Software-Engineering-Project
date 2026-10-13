import { NextResponse } from "next/server";

// ============================================================================
// VIETAI LIFE — MULTILINGUAL AUTOMATED NARRATION SERVICE
// Đề tài: Thuyết minh tự động đa ngôn ngữ
// ============================================================================

interface NarrationRequest {
  topic?: string;
  customText?: string;
  targetLang: "vi" | "en" | "fr" | "zh" | "ja" | "ko";
  style: "inspirational" | "academic" | "storytelling" | "quick";
  duration: "short" | "medium" | "full";
}

interface Segment {
  id: number;
  timeStart: string;
  timeEnd: string;
  textTarget: string;
  textVi: string;
}

export async function POST(req: Request) {
  try {
    const body: NarrationRequest = await req.json();
    const {
      topic = "Văn Miếu - Quốc Tử Giám",
      customText,
      targetLang = "en",
      style = "inspirational",
      duration = "medium"
    } = body;

    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    // 1. GỌI DEEPSEEK NẾU CÓ KEY ĐỂ SINH KỊCH BẢN THUYẾT MINH THỰC TẾ
    if (deepseekKey) {
      try {
        const langMap: Record<string, string> = {
          vi: "Tiếng Việt (Vietnamese)",
          en: "Tiếng Anh (English)",
          fr: "Tiếng Pháp (Français)",
          zh: "Tiếng Trung (Mandarin Chinese)",
          ja: "Tiếng Nhật (Japanese)",
          ko: "Tiếng Hàn (Korean)"
        };

        const styleMap: Record<string, string> = {
          inspirational: "Truyền cảm hứng, giàu chất thơ và cảm xúc",
          academic: "Hàn lâm, chuẩn xác tư liệu lịch sử và nghiên cứu",
          storytelling: "Kể chuyện lôi cuốn, sinh động như một người bạn bản địa",
          quick: "Ngắn gọn, súc tích dành cho khách tham quan nhanh"
        };

        const prompt = `Bạn là hệ thống AI "Thuyết minh tự động đa ngôn ngữ" (Automated Multilingual Narration Engine) chuyên nghiệp.
Hãy tạo kịch bản thuyết minh âm thanh hoàn chỉnh cho chủ đề: "${topic}".
${customText ? `Dựa trên nội dung cung cấp: "${customText}"` : ""}

Yêu cầu kỹ thuật:
- Ngôn ngữ thuyết minh chính: ${langMap[targetLang] || "English"}.
- Kèm bản dịch đối chiếu: Tiếng Việt.
- Phong cách thuyết minh: ${styleMap[style]}.
- Thời lượng: ${duration === "short" ? "Ngắn gọn (khoảng 1 phút, 3 phân đoạn)" : duration === "medium" ? "Tiêu chuẩn (khoảng 2 phút, 4 phân đoạn)" : "Chi tiết đầy đủ (khoảng 3-4 phút, 5 phân đoạn)"}.
- Trả về định dạng JSON hợp lệ duy nhất với cấu trúc:
{
  "title": "Tiêu đề thuyết minh",
  "topic": "${topic}",
  "targetLanguage": "${targetLang}",
  "overview": "Đoạn giới thiệu ngắn 2 câu",
  "segments": [
    {
      "id": 1,
      "timeStart": "00:00",
      "timeEnd": "00:25",
      "textTarget": "Câu thuyết minh bằng ngôn ngữ đích",
      "textVi": "Bản dịch tiếng Việt tương ứng"
    }
  ],
  "culturalTips": "Lời khuyên văn hóa cho du khách (2 gạch đầu dòng)"
}`;

        const res = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${deepseekKey}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "You are a specialized Multilingual Narration Engine. Output ONLY valid raw JSON without markdown code fences." },
              { role: "user", content: prompt }
            ],
            temperature: 0.6,
            max_tokens: 2048
          })
        });

        if (res.ok) {
          const data = await res.json();
          let rawContent = data.choices?.[0]?.message?.content?.trim() || "";
          rawContent = rawContent.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

          try {
            const parsed = JSON.parse(rawContent);
            return NextResponse.json({
              success: true,
              data: parsed,
              source: "deepseek-live"
            });
          } catch (jsonErr) {
            console.warn("JSON parse error from DeepSeek, falling back to template:", jsonErr);
          }
        }
      } catch (aiErr) {
        console.warn("AI generation failed, fallback to built-in template:", aiErr);
      }
    }

    // 2. BUILT-IN MULTILINGUAL NARRATION TEMPLATES (FALLBACK AN TOÀN)
    const fallbackData = getFallbackNarration(topic, targetLang);
    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: "local-template"
    });
  } catch (error: any) {
    console.error("Narration API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Thư viện mẫu thuyết minh chuẩn di sản Việt Nam
function getFallbackNarration(topic: string, lang: string) {
  const isEn = lang === "en";
  const isFr = lang === "fr";
  const isZh = lang === "zh";
  const isJa = lang === "ja";
  const isKo = lang === "ko";

  if (topic.includes("Hạ Long") || topic.toLowerCase().includes("ha long")) {
    return {
      title: isEn ? "Ha Long Bay — Wonder of the Earth" : "Vịnh Hạ Long — Kỳ Quan Thiên Nhiên Thế Giới",
      topic: "Vịnh Hạ Long (Quảng Ninh)",
      targetLanguage: lang,
      overview: isEn
        ? "Welcome to Ha Long Bay, an extraordinary UNESCO World Heritage site known for its emerald waters and thousands of towering limestone islands."
        : "Chào mừng quý khách đến với Vịnh Hạ Long, di sản thiên nhiên thế giới UNESCO với làn nước xanh ngọc bích và hàng nghìn hòn đảo đá vôi kỳ vĩ.",
      segments: [
        {
          id: 1,
          timeStart: "00:00",
          timeEnd: "00:30",
          textTarget: isEn
            ? "According to local legend, dragons descended from heaven to help the Vietnamese defend their homeland, leaving behind pearls that turned into these magnificent islands."
            : "Theo truyền thuyết, đàn rồng mẹ và rồng con đã hạ phàm giúp người Việt đánh giặc ngoại xâm, nhả ra hàng vạn viên ngọc châu biến thành các hòn đảo kỳ vĩ.",
          textVi: "Theo truyền thuyết, đàn rồng đã hạ phàm giúp người Việt đánh giặc, nhả ngọc châu biến thành các hòn đảo kỳ vĩ."
        },
        {
          id: 2,
          timeStart: "00:30",
          timeEnd: "01:05",
          textTarget: isEn
            ? "Over millions of years, tropical karst processes carved out mysterious grottoes such as Sung Sot Cave and Thien Cung Grotto."
            : "Trải qua hàng triệu năm kiến tạo địa chất Karst nhiệt đới, thiên nhiên đã điêu khắc nên những hang động kỳ bí như Hang Sửng Sốt và Động Thiên Cung.",
          textVi: "Trải qua hàng triệu năm kiến tạo địa chất Karst nhiệt đới, thiên nhiên đã điêu khắc nên những hang động kỳ bí như Hang Sửng Sốt và Động Thiên Cung."
        },
        {
          id: 3,
          timeStart: "01:05",
          timeEnd: "01:45",
          textTarget: isEn
            ? "As our cruise glides across the tranquil emerald bay, take a deep breath and immerse yourself in this timeless masterpiece of nature."
            : "Khi du thuyền lướt nhẹ trên mặt vịnh xanh êm ả, quý khách hãy hít một hơi thật sâu và thả hồn vào kiệt tác vĩnh cửu của đất trời.",
          textVi: "Khi du thuyền lướt nhẹ trên mặt vịnh xanh êm ả, quý khách hãy hít một hơi thật sâu và thả hồn vào kiệt tác vĩnh cửu của đất trời."
        }
      ],
      culturalTips: "• Nên mặc áo phao an toàn khi chèo thuyền kayak.\n• Giữ gìn vệ sinh môi trường biển, không xả rác xuống vịnh."
    };
  }

  // Mặc định: Văn Miếu Quốc Tử Giám
  return {
    title: isEn ? "The Temple of Literature — Imperial Academy" : "Văn Miếu - Quốc Tử Giám Hà Nội",
    topic: "Văn Miếu - Quốc Tử Giám",
    targetLanguage: lang,
    overview: isEn
      ? "Welcome to the Temple of Literature, Vietnam's first national university, founded in 1070 under Emperor Ly Thanh Tong."
      : "Chào mừng quý khách đến với Văn Miếu - Quốc Tử Giám, trường đại học đầu tiên của Việt Nam, được khởi dựng vào năm 1070 dưới triều vua Lý Thánh Tông.",
    segments: [
      {
        id: 1,
        timeStart: "00:00",
        timeEnd: "00:30",
        textTarget: isEn
          ? "Built almost a millennium ago, this sanctuary honor Confucius and celebrated scholars who shaped Vietnam's rich intellectual legacy."
          : "Được xây dựng cách đây gần một thiên niên kỷ, nơi đây phụng thờ Khổng Tử và tôn vinh những bậc hiền tài đã đặt nền móng cho nền học vấn nước nhà.",
        textVi: "Được xây dựng cách đây gần một thiên niên kỷ, nơi đây phụng thờ Khổng Tử và tôn vinh những bậc hiền tài học vấn nước nhà."
      },
      {
        id: 2,
        timeStart: "00:30",
        timeEnd: "01:05",
        textTarget: isEn
          ? "Before you stands the iconic Khue Van Pavilion, reflected serenely in the Well of Heavenly Clarity, symbolizing the brilliant literary star."
          : "Trước mắt quý khách là Khuê Văn Các cổ kính soi bóng xuống giếng Thiên Quang, biểu tượng cho ngôi sao Khuê tỏa sáng rạng ngời văn khí.",
        textVi: "Trước mắt quý khách là Khuê Văn Các cổ kính soi bóng xuống giếng Thiên Quang, biểu tượng cho ngôi sao Khuê tỏa sáng văn khí."
      },
      {
        id: 3,
        timeStart: "01:05",
        timeEnd: "01:45",
        textTarget: isEn
          ? "On either side lie 82 stone stele resting upon stone tortoises, immortalizing the names of doctorate holders, embodying the motto: 'Talent is the vital essence of the nation'."
          : "Hai bên là 82 bia đá ngự trên lưng rùa, khắc tên các vị tiến sĩ, khắc sâu chân lý bất hủ: 'Hiền tài là nguyên khí của quốc gia'.",
        textVi: "Hai bên là 82 bia tiến sĩ ngự trên lưng rùa đá, khắc sâu chân lý bất hủ: 'Hiền tài là nguyên khí của quốc gia'."
      }
    ],
    culturalTips: "• Trang phục lịch sự, giữ thái độ tôn nghiêm khi vào gian thờ Khổng Tử.\n• Không xoa đầu rùa đá để bảo tồn di sản tư liệu thế giới UNESCO."
  };
}
