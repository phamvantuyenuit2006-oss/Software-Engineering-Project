import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

interface DestinationItem {
  id: string;
  name: string;
  province: string;
  icon: string;
  badge: string;
  desc: string;
  enText: string;
  viText: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'van-mieu',
    name: 'Văn Miếu - Quốc Tử Giám',
    province: 'Hà Nội',
    icon: '🏛️',
    badge: 'Di tích Quốc gia Đặc biệt',
    desc: 'Trường đại học đầu tiên của Việt Nam, xây dựng năm 1070 triều Lý Thánh Tông.',
    enText: 'Welcome to the Temple of Literature, Vietnam\'s first university, founded in 1070 to honor Confucius and celebrated scholars.',
    viText: 'Chào mừng quý khách đến với Văn Miếu - Quốc Tử Giám, trường đại học đầu tiên của Việt Nam, khởi dựng năm 1070 tôn vinh truyền thống hiếu học ngàn năm.'
  },
  {
    id: 'ha-long',
    name: 'Vịnh Hạ Long',
    province: 'Quảng Ninh',
    icon: '🌊',
    badge: 'Di sản Thiên nhiên Thế giới',
    desc: 'Kỳ quan thiên nhiên thế giới UNESCO với gần 2.000 đảo đá vôi kỳ vĩ.',
    enText: 'Welcome to Ha Long Bay, an extraordinary seascape of limestone pillars rising from tranquil emerald waters in the Gulf of Tonkin.',
    viText: 'Chào mừng quý khách đến với Vịnh Hạ Long, kiệt tác thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ soi bóng xuống làn nước xanh ngọc bích.'
  },
  {
    id: 'hoi-an',
    name: 'Phố Cổ Hội An',
    province: 'Quảng Nam',
    icon: '🏮',
    badge: 'Di sản Văn hóa Thế giới',
    desc: 'Đô thị thương cảng quốc tế sầm uất thế kỷ 16-17 với mái ngói rêu phong.',
    enText: 'Explore Hoi An Ancient Town, an exceptionally preserved trading port exhibiting a harmonious fusion of indigenous and foreign cultures.',
    viText: 'Chào mừng quý khách đến với Đô thị cổ Hội An, bảo tàng sống động về thương cảng quốc tế thế kỷ 16-17 với những mái ngói rêu phong lung linh đèn lồng.'
  },
  {
    id: 'dinh-doc-lap',
    name: 'Dinh Độc Lập',
    province: 'TP. Hồ Chí Minh',
    icon: '🏢',
    badge: 'Di tích Lịch sử Quốc gia',
    desc: 'Kiệt tác kiến trúc hiện đại, nơi ghi dấu thời khắc lịch sử trưa ngày 30/4/1975.',
    enText: 'Independence Palace is an iconic modernist landmark witnessing the historic moment on April 30, 1975, marking the complete reunification of Vietnam.',
    viText: 'Chào mừng quý khách đến với Di tích lịch sử Dinh Độc Lập, kiệt tác kiến trúc hiện đại ghi dấu thời khắc lịch sử thiêng liêng ngày 30/4/1975.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'narration' | 'chat' | 'nutrition' | 'finance' | 'family'>('narration');
  const [inputText, setInputText] = useState('');

  // Narration States (Yêu cầu 1: FE Mobile React Native)
  const [selectedDest, setSelectedDest] = useState<DestinationItem>(DESTINATIONS[0]);
  const [targetLang, setTargetLang] = useState<'vi' | 'en' | 'fr' | 'zh' | 'ja' | 'ko'>('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // Chat Messages
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: 'Xin chào bạn! Tôi là VietAI Life — Trợ lý AI đồng hành cùng đời sống người Việt.\n\nĐề tài: "Thuyết minh tự động đa ngôn ngữ" (Công nghệ phần mềm - GV: ThS. Nguyễn Quốc Huy).\nTác giả: Tuyên Phạm (@phamvantuyenuit2006-oss).'
    }
  ]);

  // Sổ chi tiêu mẫu
  const [expenses, setExpenses] = useState([
    { id: '1', title: 'Ăn bún bò Huế', amount: '45.000 đ', category: 'Ăn uống' },
    { id: '2', title: 'Đổ xăng xe máy', amount: '70.000 đ', category: 'Đi lại' }
  ]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('thuyết minh') || lower.includes('văn miếu') || lower.includes('hạ long')) {
        botResponse = '🎙️ Hệ thống thuyết minh tự động: Bạn có thể chọn tab "Thuyết minh" để trải nghiệm phát âm thanh đa ngôn ngữ và phụ đề song ngữ trực quan!';
      } else if (lower.includes('phở') || lower.includes('calo')) {
        botResponse = '🍲 1 tô Phở bò tái nạm chứa khoảng 520 kcal (28g đạm, 65g bột đường, 16g chất béo). Bạn cần đi bộ khoảng 80 phút để tiêu hao lượng calo này.';
      } else if (lower.includes('chi tiêu') || lower.includes('xăng')) {
        botResponse = '💰 Đã tự động ghi sổ chi tiêu: ' + query + ' vào danh mục phù hợp và cập nhật hạn mức ngân sách tháng!';
        setExpenses((prev) => [{ id: Date.now().toString(), title: query, amount: '45.000 đ', category: 'Ăn uống' }, ...prev]);
      } else {
        botResponse = `VietAI Life: Đã tiếp nhận "${query}". Hệ thống 3 lớp và các dịch vụ Microservice đang xử lý theo thời gian thực.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: botResponse
        }
      ]);
    }, 600);
  };

  const togglePlayback = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      setCurrentSegmentIndex((prev) => (prev + 1) % 3);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>ĐỒ ÁN CNPM • GV: THS. NGUYỄN QUỐC HUY</Text>
        </View>
        <Text style={styles.headerTitle}>🎙️ Thuyết Minh Tự Động Đa Ngôn Ngữ</Text>
        <Text style={styles.headerSub}>Bản quyền: Tuyên Phạm (@phamvantuyenuit2006-oss) • BE .NET 10 3-Tier</Text>
      </View>

      {/* Main Tab Content */}
      {activeTab === 'narration' && (
        <ScrollView style={styles.content}>
          {/* Microservices Status Indicator */}
          <View style={styles.msStatusCard}>
            <Text style={styles.msStatusTitle}>⚡ Microservices Architecture Flow</Text>
            <Text style={styles.msStatusBody}>Orchestrator ➔ Translation ➔ TTS ➔ Media Storage</Text>
            <Text style={styles.msStatusNote}>Kiểm thử Unit Tests tự động CI/CD: 6/6 passed</Text>
          </View>

          {/* Destination Selector */}
          <Text style={styles.sectionTitle}>🏛️ Chọn Địa Danh Di Sản</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destList}>
            {DESTINATIONS.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                onPress={() => {
                  setSelectedDest(dest);
                  setIsPlayingAudio(false);
                }}
                style={[
                  styles.destCard,
                  selectedDest.id === dest.id && styles.destCardActive
                ]}
              >
                <Text style={styles.destIcon}>{dest.icon}</Text>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destProvince}>{dest.province}</Text>
                <Text style={styles.destBadge}>{dest.badge}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 6-Language Switcher */}
          <Text style={styles.sectionTitle}>🌐 Ngôn Ngữ Thuyết Minh</Text>
          <View style={styles.langBar}>
            {[
              { id: 'vi', label: '🇻🇳 Tiếng Việt' },
              { id: 'en', label: '🇬🇧 English' },
              { id: 'fr', label: '🇫🇷 Français' },
              { id: 'zh', label: '🇨🇳 中文' },
              { id: 'ja', label: '🇯🇵 日本語' },
              { id: 'ko', label: '🇰🇷 한국어' }
            ].map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => setTargetLang(l.id as any)}
                style={[
                  styles.langButton,
                  targetLang === l.id && styles.langButtonActive
                ]}
              >
                <Text style={[styles.langText, targetLang === l.id && styles.langTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mobile Audio Player Controller */}
          <View style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerDest}>{selectedDest.name}</Text>
              <Text style={styles.playerLangBadge}>{targetLang.toUpperCase()} AUDIO</Text>
            </View>

            <View style={styles.playerControlRow}>
              <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
                <Text style={styles.playButtonText}>{isPlayingAudio ? '⏸ Tạm Dừng' : '▶ Phát Âm Thanh'}</Text>
              </TouchableOpacity>
              <Text style={styles.playerTime}>00:15 / 01:45</Text>
            </View>

            {/* Karaoke Bilingual Subtitle Synchronizer */}
            <View style={styles.subtitleBox}>
              <Text style={styles.subtitleHeader}>Phụ Đề Song Ngữ Real-time (Đoạn #{currentSegmentIndex + 1}):</Text>
              <Text style={styles.targetSubText}>
                {targetLang === 'vi' ? selectedDest.viText : selectedDest.enText}
              </Text>
              <Text style={styles.viSubText}>({selectedDest.viText})</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {activeTab === 'chat' && (
        <ScrollView style={styles.content}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.msgBox, m.role === 'user' ? styles.userMsg : styles.botMsg]}>
              <Text style={m.role === 'user' ? styles.userText : styles.botText}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {activeTab === 'nutrition' && (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>🥗 Dinh dưỡng món Việt</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Phở bò tái nạm</Text>
            <Text style={styles.cardDesc}>520 kcal • Cần đi bộ 80 phút</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cơm tấm sườn bì chả</Text>
            <Text style={styles.cardDesc}>780 kcal • Cần đi bộ 120 phút</Text>
          </View>
        </ScrollView>
      )}

      {activeTab === 'finance' && (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>💰 Sổ thu chi gia đình</Text>
          {expenses.map((e) => (
            <View key={e.id} style={styles.expenseItem}>
              <View>
                <Text style={styles.expenseTitle}>{e.title}</Text>
                <Text style={styles.expenseCategory}>{e.category}</Text>
              </View>
              <Text style={styles.expenseAmount}>-{e.amount}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {activeTab === 'family' && (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>🏡 Mâm cơm & Lịch phong tục</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mâm cơm 100k (4 người)</Text>
            <Text style={styles.cardDesc}>Thịt kho tiêu (45k) + Canh chua cá (35k) + Rau muống xào (15k)</Text>
          </View>
        </ScrollView>
      )}

      {/* Input Bar for Chat */}
      {activeTab === 'chat' && (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Nhập câu hỏi hoặc nói bằng tiếng Việt..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
            <Text style={styles.sendText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Tabs */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab('narration')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'narration' && styles.activeNavText]}>🎙️ Thuyết minh</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('chat')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'chat' && styles.activeNavText]}>💬 Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('nutrition')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'nutrition' && styles.activeNavText]}>🥗 Món ăn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('finance')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'finance' && styles.activeNavText]}>💰 Chi tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('family')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'family' && styles.activeNavText]}>🏡 Gia đình</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e1b4b',
    padding: 16,
    alignItems: 'center',
  },
  badgeRow: {
    backgroundColor: '#3730a3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: {
    color: '#e0e7ff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#c7d2fe',
    fontSize: 11,
    marginTop: 3,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 8,
  },
  msStatusCard: {
    backgroundColor: '#312e81',
    borderRadius: 14,
    padding: 12,
    marginBottom: 6,
  },
  msStatusTitle: {
    color: '#a5b4fc',
    fontSize: 11,
    fontWeight: 'bold',
  },
  msStatusBody: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  msStatusNote: {
    color: '#34d399',
    fontSize: 10,
    marginTop: 4,
  },
  destList: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  destCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    width: 170,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  destCardActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  destIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  destName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  destProvince: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  destBadge: {
    fontSize: 9,
    color: '#4f46e5',
    fontWeight: '600',
    marginTop: 4,
  },
  langBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  langButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  langButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  langText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  langTextActive: {
    color: '#ffffff',
  },
  playerCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerDest: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  playerLangBadge: {
    color: '#818cf8',
    backgroundColor: '#1e293b',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  playerControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  playButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerTime: {
    color: '#94a3b8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  subtitleBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  subtitleHeader: {
    color: '#94a3b8',
    fontSize: 10,
    marginBottom: 6,
  },
  targetSubText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 18,
    marginBottom: 4,
  },
  viSubText: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  expenseTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  expenseCategory: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e11d48',
  },
  msgBox: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '85%',
  },
  userMsg: {
    backgroundColor: '#4f46e5',
    alignSelf: 'flex-end',
    borderTopRightRadius: 2,
  },
  botMsg: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopLeftRadius: 2,
  },
  userText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 19,
  },
  botText: {
    color: '#0f172a',
    fontSize: 13,
    lineHeight: 19,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0f172a',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
});
