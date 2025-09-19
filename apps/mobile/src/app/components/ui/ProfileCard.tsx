import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

interface Props {
  profileImage: string;
  fullName: string;
  isOwnProfile?: boolean;
  followerCount: string;
  followingCount: string;
  badgeText?: string;
  onEditPress?: () => void;
  onMenuPress?: () => void;
}

export default function ProfileCard({
  profileImage,
  fullName,
  isOwnProfile = false,
  followerCount,
  followingCount,
  badgeText,
  onEditPress,
  onMenuPress,
}: Props) {
  const CARD_HEIGHT = SCREEN_H * 0.11909;
  const SIDE_MARGIN = SCREEN_W * 0.06046;

  return (
    <View style={[styles.container, { height: CARD_HEIGHT, width: SCREEN_W }]}>
      <View style={[styles.contentRow, { bottom: 0, left: SIDE_MARGIN, right: SIDE_MARGIN }]}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />

        <View style={styles.nameStats}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{fullName}</Text>
            {badgeText && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statsText}>{followerCount} Takipçi</Text>
            <Text style={styles.statsText}>  •  {followingCount} Takip Edilen</Text>
          </View>
        </View>

        {isOwnProfile ? (
          <TouchableOpacity onPress={onEditPress}>
            <Text style={styles.editText}>Düzenle</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onMenuPress}>
            <Text style={styles.menuDots}>•••</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const AVATAR_SIZE = SCREEN_H * 0.058;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  contentRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 12,
  },
  nameStats: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#F13957',
    borderRadius: 10,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  editText: {
    color: '#888',
    fontSize: 14,
  },
  menuDots: {
    fontSize: 22,
    color: '#888',
    marginRight: 4,
  },
});
