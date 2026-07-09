import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { T, FONTS } from '../../theme';

function BackArrow() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12H4M4 12L10 6M4 12L10 18"
        stroke={T.ink}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GreenCheck() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Circle cx="8" cy="8" r="8" fill="#3D8A5C" />
      <Path
        d="M4.5 8l2.5 2.5 4.5-4.5"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 4l4 4-4 4"
        stroke={T.mute}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LogoutIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="13" height="18" rx="2" stroke={T.accent} strokeWidth={1.8} />
      <Path
        d="M16 8l5 4-5 4"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 12H10"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function SectionLabel({ children }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

function Hairline() {
  return <View style={styles.hairline} />;
}

export default function LoginSecurityScreen() {
  const navigation = useNavigation();

  const [passkeyEnabled, setPasskeyEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.topBtn}
          activeOpacity={0.7}
        >
          <View style={styles.backRow}>
            <BackArrow />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.topTitle}>LOGIN & SECURITY</Text>
        <View style={styles.topBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ACCOUNT */}
        <SectionLabel>ACCOUNT</SectionLabel>
        <Card>
          {/* Phone number */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Phone number</Text>
              <Text style={styles.rowSub}>+1 (415) ••• 24</Text>
            </View>
            <View style={styles.rowRight}>
              <GreenCheck />
              <Text style={styles.changeText}>Change</Text>
            </View>
          </View>

          <Hairline />

          {/* Email */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Email</Text>
              <Text style={styles.rowSub}>anika@gmail.com</Text>
            </View>
            <View style={styles.rowRight}>
              <GreenCheck />
              <Text style={styles.changeText}>Change</Text>
            </View>
          </View>

          <Hairline />

          {/* Password */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Password</Text>
              <Text style={styles.rowSub}>Last changed 3 months ago</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.changeText}>Change</Text>
            </View>
          </View>
        </Card>

        {/* SIGN-IN METHODS */}
        <SectionLabel>SIGN-IN METHODS</SectionLabel>
        <Card>
          {/* Passkey */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Passkey</Text>
              <Text style={styles.rowSub}>Sign in with Face ID — no password</Text>
            </View>
            <Switch
              value={passkeyEnabled}
              onValueChange={setPasskeyEnabled}
              trackColor={{ false: T.hair2, true: T.accent }}
              thumbColor="#fff"
            />
          </View>

          <Hairline />

          {/* Two-factor authentication */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Two-factor authentication</Text>
              <Text style={styles.rowSub}>SMS code at sign-in</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: T.hair2, true: T.accent }}
              thumbColor="#fff"
            />
          </View>

          <Hairline />

          {/* Biometric unlock */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Biometric unlock</Text>
              <Text style={styles.rowSub}>Require Face ID to open app</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: T.hair2, true: T.accent }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {/* DEVICES */}
        <SectionLabel>DEVICES</SectionLabel>
        <Card>
          {/* Active sessions */}
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Active sessions</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.mutedRight}>2 devices</Text>
              <ChevronRight />
            </View>
          </TouchableOpacity>

          <Hairline />

          {/* Login alerts */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Login alerts</Text>
              <Text style={styles.rowSub}>Email me about new sign-ins</Text>
            </View>
            <Switch
              value={loginAlertsEnabled}
              onValueChange={setLoginAlertsEnabled}
              trackColor={{ false: T.hair2, true: T.accent }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {/* Sign out of all devices */}
        <TouchableOpacity
          style={styles.signOutBtn}
          activeOpacity={0.75}
          onPress={() => {}}
        >
          <LogoutIcon />
          <Text style={styles.signOutText}>Sign out of all devices</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    backgroundColor: '#FFFFFF',
  },
  topBtn: {
    width: 80,
    height: 40,
    justifyContent: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 15,
    color: T.ink,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: T.ink,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.hair,
    overflow: 'hidden',
  },
  hairline: {
    height: 1,
    backgroundColor: T.hair,
    marginLeft: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: T.ink,
  },
  rowSub: {
    fontSize: 13,
    color: T.mute,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 14,
    color: T.accent,
    fontWeight: '500',
  },
  mutedRight: {
    fontSize: 14,
    color: T.mute,
  },
  signOutBtn: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.hair,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '500',
    color: T.accent,
  },
});
