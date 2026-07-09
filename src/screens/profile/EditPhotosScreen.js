import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';

const { width } = Dimensions.get('window');
const H_PAD = 16;
const GAP = 8;

const PHOTO_GRADIENTS = [
  ['#D4A5A0', '#A07070'],
  ['#E8D4C0', '#C8B090'],
  ['#C0D4E8', '#90B0C8'],
  ['#D4E8C0', '#B0C890'],
  ['#E8C0D4', '#C890B0'],
];

function XIcon({ size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function DragIcon({ size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="7" r="1.5" fill="rgba(255,255,255,0.8)" />
      <Circle cx="15" cy="7" r="1.5" fill="rgba(255,255,255,0.8)" />
      <Circle cx="9" cy="12" r="1.5" fill="rgba(255,255,255,0.8)" />
      <Circle cx="15" cy="12" r="1.5" fill="rgba(255,255,255,0.8)" />
      <Circle cx="9" cy="17" r="1.5" fill="rgba(255,255,255,0.8)" />
      <Circle cx="15" cy="17" r="1.5" fill="rgba(255,255,255,0.8)" />
    </Svg>
  );
}

function PlusIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={T.mute}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function WarningIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="#92400E"
        strokeWidth={1.8}
        fill="none"
      />
      <Path
        d="M12 9v4M12 17h.01"
        stroke="#92400E"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PhotoSlot({ gradientColors, index, isMain = false, onRemove }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#C4856A' }]} />

      {/* X button top-right */}
      <TouchableOpacity
        style={styles.xButton}
        onPress={onRemove}
        activeOpacity={0.8}
      >
        <XIcon size={12} />
      </TouchableOpacity>

      {/* Main photo badges top-left */}
      {isMain && (
        <View style={styles.mainBadgeGroup}>
          <View style={styles.mainBadge}>
            <Text style={styles.mainBadgeText}>MAIN</Text>
          </View>
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>Match</Text>
          </View>
        </View>
      )}

      {/* Main photo extra info bottom-left */}
      {isMain && (
        <View style={styles.photoCountBadge}>
          <Text style={styles.photoCountText}>▣ 5</Text>
        </View>
      )}

      {/* Drag handle bottom-right */}
      <View style={styles.dragHandle}>
        <DragIcon size={16} />
      </View>
    </View>
  );
}

function AddSlot() {
  return (
    <View style={styles.addSlotInner}>
      <PlusIcon size={22} />
      <Text style={styles.addSlotLabel}>Add</Text>
    </View>
  );
}

export default function EditPhotosScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState([0, 1, 2, 3, 4]);

  const handleRemove = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const mainW = (width - H_PAD * 2) * 0.58;
  const sideW = (width - H_PAD * 2) - mainW - GAP;
  const sideH = (220 - GAP) / 2;

  const row2W = (width - H_PAD * 2 - GAP * 2) / 3;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarLeft}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EDIT PHOTOS</Text>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Drag to reorder. Your first photo is what matches see first.
        </Text>

        {/* Row 1 */}
        <View style={styles.row1}>
          {/* Main photo */}
          <View style={[styles.mainPhoto, { width: mainW, height: 220 }]}>
            <PhotoSlot
              gradientColors={PHOTO_GRADIENTS[0]}
              index={0}
              isMain
              onRemove={() => handleRemove(0)}
            />
          </View>

          {/* Right side stacked */}
          <View style={{ width: sideW, gap: GAP }}>
            <View style={[styles.sidePhoto, { height: sideH }]}>
              <PhotoSlot
                gradientColors={PHOTO_GRADIENTS[1]}
                index={1}
                onRemove={() => handleRemove(1)}
              />
            </View>
            <View style={[styles.sidePhoto, { height: sideH }]}>
              <PhotoSlot
                gradientColors={PHOTO_GRADIENTS[2]}
                index={2}
                onRemove={() => handleRemove(2)}
              />
            </View>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row2}>
          <View style={[styles.row2Photo, { width: row2W, height: 120 }]}>
            <PhotoSlot
              gradientColors={PHOTO_GRADIENTS[3]}
              index={3}
              onRemove={() => handleRemove(3)}
            />
          </View>
          <View style={[styles.row2Photo, { width: row2W, height: 120 }]}>
            <PhotoSlot
              gradientColors={PHOTO_GRADIENTS[4]}
              index={4}
              onRemove={() => handleRemove(4)}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.addSlot, { width: row2W, height: 120 }]}
          >
            <AddSlot />
          </TouchableOpacity>
        </View>

        {/* Warning card */}
        <View style={styles.warningCard}>
          <WarningIcon size={20} />
          <View style={styles.warningTextBlock}>
            <Text style={styles.warningBold}>
              Profiles with a clear face photo and at least 4 images get 3× more interest.
            </Text>
            <Text style={styles.warningRegular}>
              Avoid group shots as your main photo.
            </Text>
          </View>
        </View>

        {/* Slots filled */}
        <Text style={styles.slotsText}>5 of 6 slots filled</Text>
      </ScrollView>

      {/* Sticky Save button */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save photos</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  topBarLeft: {
    width: 70,
  },
  backText: {
    fontSize: 14,
    color: T.ink,
    fontFamily: FONTS.ui,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: FONTS.mono,
    color: T.ink,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  topBarRight: {
    width: 70,
    alignItems: 'flex-end',
  },
  saveTopText: {
    fontSize: 14,
    color: T.accent,
    fontFamily: FONTS.ui,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: H_PAD,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 13,
    color: T.mute,
    fontFamily: FONTS.ui,
    lineHeight: 19,
    marginBottom: 14,
  },
  row1: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: GAP,
  },
  mainPhoto: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  sidePhoto: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  row2: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: 20,
  },
  row2Photo: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  addSlot: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(42,39,35,0.2)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSlotInner: {
    alignItems: 'center',
    gap: 4,
  },
  addSlotLabel: {
    fontSize: 12,
    color: T.mute,
    fontFamily: FONTS.ui,
  },
  xButton: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mainBadgeGroup: {
    position: 'absolute',
    top: 7,
    left: 7,
    flexDirection: 'row',
    gap: 4,
    zIndex: 10,
  },
  mainBadge: {
    backgroundColor: '#D93025',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  mainBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    fontFamily: FONTS.mono,
  },
  matchBadge: {
    backgroundColor: T.verify,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  matchBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
    fontFamily: FONTS.ui,
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 7,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.40)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 10,
  },
  photoCountText: {
    fontSize: 11,
    color: '#fff',
    fontFamily: FONTS.ui,
    fontWeight: '600',
  },
  dragHandle: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    zIndex: 10,
    padding: 2,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningTextBlock: {
    flex: 1,
    gap: 4,
  },
  warningBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F',
    fontFamily: FONTS.ui,
    lineHeight: 18,
  },
  warningRegular: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: FONTS.ui,
    lineHeight: 17,
  },
  slotsText: {
    textAlign: 'center',
    fontSize: 13,
    color: T.mute,
    fontFamily: FONTS.ui,
    marginBottom: 8,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: H_PAD,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: T.accent,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    fontFamily: FONTS.ui,
    letterSpacing: 0.3,
  },
});
