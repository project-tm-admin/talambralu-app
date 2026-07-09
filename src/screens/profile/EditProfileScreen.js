import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';

const SECTIONS = [
  {
    icon: 'camera',
    title: 'Photos',
    subtitle: '5 added · drag to reorder',
    status: 'done',
    screen: 'EditPhotos',
  },
  {
    icon: 'quote',
    title: 'About & prompts',
    subtitle: 'Headline · 2 prompts · voice intro',
    status: 'done',
    screen: 'EditAbout',
  },
  {
    icon: 'person',
    title: 'Basics',
    subtitle: "29 · 5'5\" · San Francisco, CA",
    status: 'done',
    screen: 'EditBasics',
  },
  {
    icon: 'briefcase',
    title: 'Career & education',
    subtitle: 'Senior SWE, Stripe · MS, CMU',
    status: 'done',
    screen: 'EditCareer',
  },
  {
    icon: 'family',
    title: 'Family',
    subtitle: 'Nuclear · Vijayawada, India',
    status: 'done',
    screen: 'EditFamily',
  },
  {
    icon: 'star',
    title: 'Jaathakam',
    subtitle: 'Rohini · Vrishabha · Kasyapa',
    status: 'done',
    screen: 'EditJaathakam',
  },
  {
    icon: 'leaf',
    title: 'Lifestyle',
    subtitle: 'Add diet, habits & interests',
    status: 'todo',
    screen: 'EditJaathakam',
  },
  {
    icon: 'shield',
    title: 'Trust & verification',
    subtitle: '3 of 5 verified',
    status: 'todo',
    screen: 'EditTrust',
  },
];

function CameraIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={13} r={4} stroke={T.accent} strokeWidth={1.8} />
    </Svg>
  );
}

function QuoteIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PersonIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={T.accent} strokeWidth={1.8} />
      <Path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function BriefcaseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect
        x={2}
        y={7}
        width={20}
        height={14}
        rx={2}
        stroke={T.accent}
        strokeWidth={1.8}
      />
      <Path
        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path d="M12 12v4M10 14h4" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function FamilyIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={3} stroke={T.accent} strokeWidth={1.8} />
      <Circle cx={16} cy={8} r={2.5} stroke={T.accent} strokeWidth={1.8} />
      <Path
        d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M20 20c0-2.2-1.8-4-4-4"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LeafIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 8C8 10 5.9 16.17 3.82 19.18c-.28.4.16.86.56.6C7.28 18 11.5 17 14 17c3 0 7-1.5 8-8 .5-3-1-7-5-7z"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.82 19.18C4 16 6 12 10 10"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={T.mute}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckBadge() {
  return (
    <View style={styles.checkBadge}>
      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20 6L9 17l-5-5"
          stroke="#fff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function TodoBadge() {
  return (
    <View style={styles.todoBadge}>
      <Text style={styles.todoBadgeText}>TODO</Text>
    </View>
  );
}

function SectionIcon({ type }) {
  const icons = {
    camera: <CameraIcon />,
    quote: <QuoteIcon />,
    person: <PersonIcon />,
    briefcase: <BriefcaseIcon />,
    family: <FamilyIcon />,
    star: <StarIcon />,
    leaf: <LeafIcon />,
    shield: <ShieldIcon />,
  };
  return (
    <View style={styles.iconBox}>
      {icons[type] || null}
    </View>
  );
}

export default function EditProfileScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarSide}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EDIT PROFILE</Text>
        <View style={styles.topBarSide} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: '#C4869B' }]} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Anika Talluri</Text>
            <Text style={styles.profileSub}>How matches see you</Text>
          </View>
          <TouchableOpacity style={styles.previewPill}>
            <Text style={styles.previewPillText}>👁 Preview</Text>
          </TouchableOpacity>
        </View>

        {/* Completion Card */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionLabel}>Profile completion</Text>
            <Text style={styles.completionPct}>84%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Sections Label */}
        <Text style={styles.sectionsLabel}>PROFILE SECTIONS</Text>

        {/* Section Rows */}
        <View style={styles.sectionList}>
          {SECTIONS.map((item, idx) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.sectionRow,
                idx < SECTIONS.length - 1 && styles.sectionRowBorder,
              ]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <SectionIcon type={item.icon} />
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <Text style={styles.sectionSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.sectionRight}>
                {item.status === 'done' ? <CheckBadge /> : <TodoBadge />}
                <ChevronRight />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPad} />
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    backgroundColor: '#FFFFFF',
  },
  topBarSide: {
    width: 72,
  },
  topBarRight: {
    alignItems: 'flex-end',
  },
  backText: {
    fontSize: 15,
    color: T.ink,
    fontFamily: FONTS.mono,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: FONTS.mono,
    letterSpacing: 1.2,
    color: T.ink,
  },
  saveText: {
    fontSize: 15,
    color: T.accent,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.bg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: T.ink,
    fontFamily: FONTS.display,
    marginBottom: 3,
  },
  profileSub: {
    fontSize: 13,
    color: T.mute,
  },
  previewPill: {
    borderWidth: 1.5,
    borderColor: T.hair2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  previewPillText: {
    fontSize: 13,
    color: T.ink,
    fontWeight: '500',
  },
  completionCard: {
    backgroundColor: T.bg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  completionLabel: {
    fontSize: 14,
    color: T.ink,
    fontWeight: '500',
  },
  completionPct: {
    fontSize: 14,
    fontWeight: '700',
    color: T.accent,
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#EDE8E2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    width: '84%',
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 4,
  },
  sectionsLabel: {
    fontSize: 11,
    fontFamily: FONTS.mono,
    letterSpacing: 1.4,
    color: T.mute,
    marginBottom: 8,
    paddingLeft: 2,
  },
  sectionList: {
    backgroundColor: T.bg,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hair,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FDF6F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderWidth: 1,
    borderColor: T.hair,
  },
  sectionText: {
    flex: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 17,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: T.verify,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  todoBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C05621',
    fontFamily: FONTS.mono,
  },
  bottomPad: {
    height: 40,
  },
});
