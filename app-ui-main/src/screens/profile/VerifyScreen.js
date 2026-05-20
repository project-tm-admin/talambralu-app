import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Primary from '../../components/Primary';
import { VerifyDot } from '../../components/VerifyBadge';

function BigAvatar() {
  return (
    <View style={styles.avatarWrap}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AR</Text>
      </View>
      <View style={styles.greenCheck}>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Circle cx="9" cy="9" r="9" fill={T.verify} />
          <Path d="M5 9l3 3 5-5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    </View>
  );
}

function ActionRow({ icon, title, subtitle, cta, onPress, iconBg }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIcon, iconBg && { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.actionSub}>{subtitle}</Text> : null}
      </View>
      <View style={styles.actionCta}>
        <Text style={styles.actionCtaText}>{cta}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PhotoIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#2E8B7A" strokeWidth={1.6} fill="none" />
      <Circle cx="12" cy="13" r="4" stroke="#2E8B7A" strokeWidth={1.6} />
    </Svg>
  );
}

function DocumentIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={T.verify} strokeWidth={1.6} fill="none" />
      <Path d="M14 2v6h6M9 12h6M9 16h4" stroke={T.verify} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function BellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={T.mute} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export default function VerifyScreen() {
  const navigation = useNavigation();
  const [notifOn, setNotifOn] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar showBack={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={14} total={14} />

        <BigAvatar />

        <Text style={styles.almostTitle}>You're almost in,{'\n'}Anika</Text>
        <Text style={styles.almostSub}>A few quick steps to get the best matches</Text>

        <ActionRow
          icon={<PhotoIcon />}
          iconBg="#C2EDE7"
          title="Verify your photo"
          subtitle="Take a selfie to match your profile"
          cta="Verify →"
          onPress={() => {}}
        />

        <ActionRow
          icon={<DocumentIcon />}
          title="Verify your visa"
          subtitle="H-1B · Upload I-797 for badge"
          cta="Upload →"
          onPress={() => {}}
        />

        <TouchableOpacity style={styles.notifRow} activeOpacity={0.7}>
          <View style={styles.actionIcon}>
            <BellIcon />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Match notifications</Text>
            <Text style={styles.actionSub}>Get notified when someone is interested</Text>
          </View>
          <Switch
            value={notifOn}
            onValueChange={setNotifOn}
            trackColor={{ false: T.hair2, true: T.accent }}
            thumbColor="#fff"
          />
        </TouchableOpacity>

        <Primary
          label="See your matches"
          onPress={() => navigation.navigate('MainTabs')}
          style={{ marginTop: 28 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'stretch' },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: T.accentInk,
  },
  greenCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  almostTitle: {
    fontFamily: FONTS.display,
    fontSize: 34,
    color: T.ink,
    lineHeight: 42,
    textAlign: 'center',
    marginBottom: 8,
  },
  almostSub: {
    fontSize: 14,
    color: T.mute,
    textAlign: 'center',
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.field,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { flex: 1 },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
  },
  actionSub: {
    fontSize: 12,
    color: T.mute,
    marginTop: 2,
  },
  actionCta: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  actionCtaText: {
    fontSize: 13,
    color: T.accent,
    fontWeight: '600',
  },
});
