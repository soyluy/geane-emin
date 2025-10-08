// mobile/src/app/components/ui/UserMenü/MyMessages.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('screen');
const LEFT_PAD = SCREEN_W * 0.05813;   // %5,813 sol boşluk
const RIGHT_PAD = SCREEN_W * 0.05813;  // %5,813 sağ boşluk
const AVATAR_SIZE = 52;

interface Props {
  onClose: () => void;
}

// Geçici mesaj verisi
const SAMPLE_MESSAGES = [
  {
    id: '1',
    senderName: 'Kullanıcı Adı',
    message: 'Bu bir örnek mesaj metnidir. Uzun mesajlarda nasıl görüneceğini test etmek için yazılmıştır.',
    timestamp: '14:30',
    avatar: 'https://via.placeholder.com/52x52/E5E7EB/9CA3AF?text=K'
  },
  {
    id: '2', 
    senderName: 'Kullanıcı Adı',
    message: 'Kısa mesaj',
    timestamp: '13:45',
    avatar: 'https://via.placeholder.com/52x52/E5E7EB/9CA3AF?text=K'
  },
  {
    id: '3',
    senderName: 'Kullanıcı Adı', 
    message: 'Çok uzun bir mesaj metni örneği. Bu metin sığmadığı yerde üç nokta ile kesilecek ve devamı olduğu algısı yaratılacak.',
    timestamp: '12:15',
    avatar: 'https://via.placeholder.com/52x52/E5E7EB/9CA3AF?text=K'
  }
];

const MessageItem = React.memo(({ item }: { item: any }) => {
  return (
    <View style={styles.messageContainer}>
      {/* Avatar */}
      <Image 
        source={{ uri: item.avatar }}
        style={styles.avatar}
      />
      
      {/* Mesaj İçeriği */}
      <View style={styles.messageContent}>
        {/* Üst Satır: Kullanıcı Adı + Zaman */}
        <View style={styles.headerRow}>
          <Text style={styles.senderName}>{item.senderName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        {/* Mesaj Metni */}
        <Text 
          style={styles.messageText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.message}
        </Text>
      </View>
    </View>
  );
});

export default function MyMessages(_: Props) {
  const renderMessage = ({ item }: { item: any }) => <MessageItem item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingLeft: LEFT_PAD,
    paddingRight: RIGHT_PAD,
    paddingVertical: 18, // 12'den 18'e artırıldı
    alignItems: 'flex-start',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E5E7EB',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12, // Avatar ile içerik arası boşluk
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 16 * 0.02, // %2 letter spacing
    color: '#303336',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Light',
    color: '#303336',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    letterSpacing: 14 * 0.02, // %2 letter spacing
    color: '#696D70',
    lineHeight: 20,
  },
});
