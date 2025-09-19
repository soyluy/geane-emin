// src/app/components/ui/InboxPanel.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';

interface Message {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface InboxPanelProps {
  onClose: () => void;   // PanelShell'den gelir
  messages?: Message[];
}

export default function InboxPanel({ onClose, messages = [] }: InboxPanelProps) {
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
    </View>
  );

  if (messages.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>Henüz bir bildirimin yok.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderMessage}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    paddingRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    fontSize: 13,
    color: '#555',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});
