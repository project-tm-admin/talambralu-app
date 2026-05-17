import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import Avatar from '../../components/Avatar';
import { VerifyDot } from '../../components/VerifyBadge';

const CONVERSATIONS = [
  {
    name: 'Priya M.',
    preview: "That's such a lovely way to describe it! My paati's kitchen smells exactly like...",
    time: '2m',
    unread: 2,
    verified: true,
    online: true,
  },
  {
    name: 'Kavitha S.',
    preview: "Looking forward to our call this weekend 🙂",
    time: '1h',
    unread: 0,
    verified: true,
    online: false,
  },
  {
    name: 'Divya N.',
    preview: 'Sent a voice message',
    time: '3h',
    unread: 1,
    verified: false,
    online: false,
  },
  {
    name: 'Rohini P.',
    preview: "So I was thinking — would you be open to a video call?",
    time: 'Tue',
    unread: 0,
    verified: true,
    online: false,
  },
];

const REQUESTS = [
  { name: 'Meera V.', verified: true },
  { name: 'Swetha R.', verified: true },
  { name: 'Bhavana K.', verified: false },
];

function StarIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24">
      <Path
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        fill="#D4A017"
      />
    </Svg>
  );
}

function OnlineDot() {
  return <View style={styles.onlineDot} />;
}

function ConvRow({ conv, onPress }) {
  return (
    <TouchableOpacity style={styles.convRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.convAvatar}>
        <Avatar name={conv.name} size={52} />
        {conv.online && <OnlineDot />}
        {conv.verified && <View style={styles.convVerify}><VerifyDot size={14} /></View>}
      </View>
      <View style={styles.convText}>
        <View style={styles.convHeader}>
          <Text style={styles.convName}>{conv.name}</Text>
          <Text style={[styles.convTime, conv.unread > 0 && styles.convTimeUnread]}>{conv.time}</Text>
        </View>
        <Text style={[styles.convPreview, conv.unread > 0 && styles.convPreviewBold]} numberOfLines={1}>
          {conv.preview}
        </Text>
      </View>
      {conv.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{conv.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState('conversations');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      {/* Segmented tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'conversations', label: 'Conversations' },
          { key: 'requests', label: 'Requests', badge: 3 },
          { key: 'archived', label: 'Archived' },
        ].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
            {t.badge ? (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{t.badge}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'requests' && (
          <>
            {/* Requests strip */}
            <View style={styles.requestsStrip}>
              <View style={styles.requestAvatarRow}>
                {REQUESTS.map((r, i) => (
                  <View key={i} style={[styles.requestAvatar, { marginLeft: i > 0 ? -12 : 0 }]}>
                    <Avatar name={r.name} size={40} />
                  </View>
                ))}
                <View style={styles.requestMoreBubble}>
                  <Text style={styles.requestMoreText}>+5</Text>
                </View>
              </View>
              <View style={styles.requestTextWrap}>
                <Text style={styles.requestText}>
                  <Text style={styles.requestBold}>8 people</Text> expressed interest
                </Text>
                <Text style={styles.requestSub}>Verified users only · Tap to review</Text>
              </View>
            </View>

            {REQUESTS.map((r, i) => (
              <TouchableOpacity
                key={i}
                style={styles.convRow}
                onPress={() => navigation.navigate('Chat')}
                activeOpacity={0.7}
              >
                <View style={styles.convAvatar}>
                  <Avatar name={r.name} size={52} />
                  {r.verified && <View style={styles.convVerify}><VerifyDot size={14} /></View>}
                </View>
                <View style={styles.convText}>
                  <View style={styles.convHeader}>
                    <Text style={styles.convName}>{r.name}</Text>
                    <Text style={styles.convTime}>2d</Text>
                  </View>
                  <Text style={styles.convPreview}>Sent you a connection request</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {tab === 'conversations' && (
          <>
            {CONVERSATIONS.map((conv, i) => (
              <ConvRow
                key={i}
                conv={conv}
                onPress={() => navigation.navigate('Chat')}
              />
            ))}

            {/* Premium upsell */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumIcon}>
                <StarIcon />
              </View>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Upgrade to unlock video calls</Text>
                <Text style={styles.premiumSub}>See who likes you, unlimited messaging & more</Text>
              </View>
              <TouchableOpacity style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {tab === 'archived' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No archived conversations</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 30,
    color: T.ink,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 5,
  },
  tabActive: {
    borderBottomColor: T.accent,
  },
  tabText: {
    fontSize: 13,
    color: T.mute,
    fontWeight: '500',
  },
  tabTextActive: {
    color: T.accent,
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: T.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  requestsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  requestAvatarRow: {
    flexDirection: 'row',
  },
  requestAvatar: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 22,
  },
  requestMoreBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.field,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  requestMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.accent,
  },
  requestTextWrap: { flex: 1 },
  requestText: { fontSize: 14, color: T.ink },
  requestBold: { fontWeight: '700' },
  requestSub: { fontSize: 11, color: T.mute, marginTop: 2 },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    gap: 12,
  },
  convAvatar: {
    position: 'relative',
  },
  convVerify: {
    position: 'absolute',
    bottom: -1,
    right: -1,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: T.verify,
    borderWidth: 2,
    borderColor: '#fff',
  },
  convText: { flex: 1 },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  convName: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
  },
  convTime: {
    fontSize: 12,
    color: T.mute,
  },
  convTimeUnread: { color: T.accent, fontWeight: '600' },
  convPreview: {
    fontSize: 13,
    color: T.mute,
  },
  convPreviewBold: {
    color: T.ink2,
    fontWeight: '500',
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#FFFAED',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0D87A',
    gap: 10,
  },
  premiumIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF3B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumText: { flex: 1 },
  premiumTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B4C00',
  },
  premiumSub: {
    fontSize: 11,
    color: '#9A7010',
    marginTop: 2,
  },
  upgradeBtn: {
    backgroundColor: '#D4A017',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
  },
  upgradeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: T.mute,
  },
});
