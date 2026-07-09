import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';

function PencilIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213l-4 1 1-4L16.862 3.487z"
        stroke={T.mute}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SectionLabel({ label, showEdit = false }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {showEdit && (
        <TouchableOpacity style={styles.editIcon} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <PencilIcon />
        </TouchableOpacity>
      )}
    </View>
  );
}

function FieldCard({ label, value, suffix, style }) {
  return (
    <View style={[styles.fieldCard, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueRow}>
        <Text style={styles.fieldValue}>{value}</Text>
        {suffix ? <Text style={styles.fieldSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function PillToggle({ options, selected, onSelect }) {
  return (
    <View style={styles.pillGroup}>
      {options.map((opt) => {
        const isSelected = opt === selected;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            style={[
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillUnselected,
            ]}
            activeOpacity={0.75}
          >
            <Text style={[styles.pillText, isSelected ? styles.pillTextSelected : styles.pillTextUnselected]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function EditJaathakamScreen() {
  const navigation = useNavigation();
  const [manglik, setManglik] = useState('No');
  const [shareJaathakam, setShareJaathakam] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarLeft} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.topBarBack}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EDIT JAATHAKAM</Text>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BIRTH DETAILS */}
        <SectionLabel label="BIRTH DETAILS" />

        <View style={styles.row}>
          <FieldCard
            label="BIRTH DATE"
            value="14 May 1997"
            style={{ flex: 1, marginRight: 8 }}
          />
          <FieldCard
            label="BIRTH TIME"
            value="04:32 AM"
            suffix="IST"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        <FieldCard
          label="BIRTH PLACE"
          value="Vijayawada, Andhra Pradesh"
          style={styles.fieldFullWidth}
        />

        {/* NAKSHATRA & RASI */}
        <SectionLabel label="NAKSHATRA & RASI" showEdit />

        <View style={styles.nakshatraCard}>
          <View style={styles.row}>
            <View style={[styles.nakshatraCell, { borderRightWidth: 1, borderRightColor: T.hair }]}>
              <Text style={styles.nakshatraMain}>Rohini</Text>
              <Text style={styles.nakshatraTelugu}>రోహిణి</Text>
            </View>
            <View style={styles.nakshatraCell}>
              <Text style={styles.nakshatraMain}>Vrishabha</Text>
              <Text style={styles.nakshatraTelugu}>వృషభం</Text>
            </View>
          </View>
          <Text style={styles.nakshatraNote}>
            Auto-calculated from your birth details. Tap to override.
          </Text>
        </View>

        {/* DETAILS */}
        <SectionLabel label="DETAILS" />

        <FieldCard
          label="GOTHRAM"
          value="Kasyapa"
          style={styles.fieldFullWidth}
        />

        {/* Manglik / Dosham */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Manglik / Dosham</Text>
          <PillToggle
            options={['Yes', 'No']}
            selected={manglik}
            onSelect={setManglik}
          />
        </View>

        {/* Share Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextWrap}>
            <Text style={styles.toggleTitle}>Show jaathakam to matches</Text>
            <Text style={styles.toggleSub}>Shared only after you both express interest</Text>
          </View>
          <Switch
            value={shareJaathakam}
            onValueChange={setShareJaathakam}
            trackColor={{ false: T.hair2, true: T.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Bottom padding for sticky button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Save Button */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save jaathakam</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  topBarLeft: {
    minWidth: 60,
  },
  topBarBack: {
    fontSize: 15,
    color: T.ink,
    fontFamily: FONTS.ui,
  },
  topBarTitle: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: T.ink,
  },
  topBarRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  topBarSave: {
    fontSize: 15,
    color: T.accent,
    fontFamily: FONTS.ui,
    fontWeight: '600',
  },

  /* Scroll */
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },

  /* Section Label */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 10,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.4,
    color: T.mute,
  },
  editIcon: {
    padding: 2,
  },

  /* Field Cards */
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.hair,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldFullWidth: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    color: T.mute,
    marginBottom: 6,
  },
  fieldValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  fieldValue: {
    fontSize: 15,
    color: T.ink,
    fontFamily: FONTS.ui,
    fontWeight: '500',
  },
  fieldSuffix: {
    fontSize: 12,
    color: T.mute,
    fontFamily: FONTS.ui,
  },

  /* Nakshatra Card */
  nakshatraCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.hair,
    overflow: 'hidden',
    marginBottom: 8,
  },
  nakshatraCell: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  nakshatraMain: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: T.ink,
    marginBottom: 4,
  },
  nakshatraTelugu: {
    fontSize: 13,
    color: T.mute,
    fontFamily: FONTS.ui,
  },
  nakshatraNote: {
    fontSize: 12,
    color: T.mute,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
    lineHeight: 17,
  },

  /* Manglik inline row */
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.hair,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
  },
  inlineLabel: {
    fontSize: 15,
    color: T.ink,
    fontFamily: FONTS.ui,
    fontWeight: '500',
  },

  /* Pill Toggle */
  pillGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillSelected: {
    backgroundColor: T.accent,
  },
  pillUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.hair2,
  },
  pillText: {
    fontSize: 13,
    fontFamily: FONTS.ui,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  pillTextUnselected: {
    color: T.ink,
  },

  /* Share Toggle Row */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.hair,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
    gap: 12,
  },
  toggleTextWrap: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    color: T.ink,
    fontFamily: FONTS.ui,
    fontWeight: '700',
    marginBottom: 3,
  },
  toggleSub: {
    fontSize: 12,
    color: T.mute,
    fontFamily: FONTS.ui,
    lineHeight: 17,
  },

  /* Sticky Bottom */
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: T.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.ui,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
