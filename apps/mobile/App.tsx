import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'nutrition' | 'finance' | 'family'>('chat');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: 'Xin chào bạn! Tôi là VietAI Life — Trợ lý AI đồng hành cùng đời sống người Việt.\n\nBạn có thể hỏi tôi về calo món Việt (phở, cơm tấm), ghi sổ chi tiêu bằng giọng nói, gợi ý mâm cơm đi chợ 100k hoặc hướng dẫn thủ tục trên VNeID!'
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

      if (lower.includes('phở') || lower.includes('calo')) {
        botResponse = '🍲 1 tô Phở bò tái nạm chứa khoảng 520 kcal (28g đạm, 65g bột đường, 16g chất béo). Bạn cần đi bộ khoảng 80 phút để tiêu hao lượng calo này.';
      } else if (lower.includes('chi tiêu') || lower.includes('bún bò') || lower.includes('xăng')) {
        botResponse = '💰 Đã tự động ghi sổ chi tiêu: ' + query + ' vào danh mục phù hợp và cập nhật hạn mức ngân sách tháng!';
        setExpenses((prev) => [{ id: Date.now().toString(), title: query, amount: '45.000 đ', category: 'Ăn uống' }, ...prev]);
      } else if (lower.includes('chợ') || lower.includes('100k') || lower.includes('cơm')) {
        botResponse = '🏡 Mâm cơm 100k cho 4 người:\n1. Thịt ba chỉ kho tiêu (45k)\n2. Canh chua cá điêu hồng (35k)\n3. Rau muống xào tỏi (15k)\n👉 Tổng chi: 95.000 đ.';
      } else {
        botResponse = `VietAI Life: Đã tiếp nhận "${query}". Tôi đang đồng bộ dữ liệu và hỗ trợ bạn theo đúng bối cảnh đời sống Việt Nam.`;
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002060" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VietAI Life Mobile</Text>
        <Text style={styles.headerSub}>Trợ lý đời sống người Việt (Âm lịch: 04/09 Bính Ngọ)</Text>
      </View>

      {/* Quick Action Pills */}
      <View style={styles.quickBar}>
        <TouchableOpacity style={styles.pill} onPress={() => handleSend('Tô phở bò bao nhiêu calo?')}>
          <Text style={styles.pillText}>🥗 Calo Phở bò</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill} onPress={() => handleSend('Trưa nay ăn bún bò 45k')}>
          <Text style={styles.pillText}>🎤 Ghi chi tiêu 45k</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill} onPress={() => handleSend('Đi chợ 100k nấu cơm 4 người')}>
          <Text style={styles.pillText}>🏡 Mâm cơm 100k</Text>
        </TouchableOpacity>
      </View>

      {/* Main Tab Content */}
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
          <Text style={styles.sectionTitle}>🥗 Dinh dưỡng món Việt hôm nay</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Phở bò tái nạm</Text>
            <Text style={styles.cardDesc}>520 kcal • Cần đi bộ 80 phút</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cơm tấm sườn bì chả</Text>
            <Text style={styles.cardDesc}>780 kcal • Cần đi bộ 120 phút</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bánh mì thịt chả</Text>
            <Text style={styles.cardDesc}>460 kcal • Cần đi bộ 70 phút</Text>
          </View>
        </ScrollView>
      )}

      {activeTab === 'finance' && (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>💰 Sổ chi tiêu nhanh</Text>
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
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rằm Tháng Chín (15/09 Âm lịch)</Text>
            <Text style={styles.cardDesc}>Thứ Sáu, 24/10/2026 • Ngày ăn chay & cúng gia tiên</Text>
          </View>
        </ScrollView>
      )}

      {/* Input Bar */}
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

      {/* Bottom Tabs */}
      <View style={styles.bottomNav}>
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
    backgroundColor: '#002060',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#bfdbfe',
    fontSize: 12,
    marginTop: 2,
  },
  quickBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-around',
  },
  pill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  pillText: {
    fontSize: 11,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
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
    backgroundColor: '#1d4ed8',
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
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0f172a',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#002060',
    paddingHorizontal: 16,
    height: 44,
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
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#002060',
    fontWeight: 'bold',
  },
});
