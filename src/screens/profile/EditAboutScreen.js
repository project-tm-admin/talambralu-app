import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';

const HEADLINE_MAX = 60;
const HEADLINE_DEFAULT = 'Filter-coffee optimist building things at Stripe.';

const PROMPTS = [
  {
    question: 'What does "home" mean to you?',
    answer:
      'Sunday filter coffee, my mom on speakerphone, and the smell of tadka somewhere in the building.',
  },
  {
    question: 'A weekend done right is...',
    answer:
      'A long hike, a temple visit with friends, and dosa for dinner. Phone on silent.',
  },
];

const WAVEFORM_HEIGHTS = [10, 22, 36, 18, 30, 14, 28, 20, 36, 12, 24, 32, 16, 26, 18, 10, 28, 20, 14, 22];

function PencilIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={T.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlayIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="6,4 20,12 6,20"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function ChevronLeftIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={T.ink}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WaveformViz() {
  return (
    <View style={styles.waveRow}>
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <View
          key={i}
          style={[
            styles.waveBar,
            { height: h, backgroundColor: i < 10 ? T.accent : T.hair2 },
          ]}
        />
      ))}
    </View>
  );
}

function PromptCard({ question, answer }) {
  return (
    <View style={styles.promptCard}>
      <View style={styles.promptCardHeader}>
        <Text style={styles.promptQuestion}>{question}</Text>
        <TouchableOpacity activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <PencilIcon />
        </TouchableOpacity>
      </View>
      <Text style={styles.promptAnswer}>{answer}</Text>
    </View>
  );
}

export default function EditAboutScreen() {
  const navigation = useNavigation();
  const [headline, setHeadline] = useState(HEADLINE_DEFAULT);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarBack}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon />
          <Text style={styles.topBarBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EDIT ABOUT</Text>
        <View style={styles.topBarSave} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADLINE section */}
        <Text style={styles.sectionLabel}>HEADLINE</Text>
        <View style={styles.headlineField}>
          <View style={styles.headlineLabelRow}>
            <Text style={styles.headlineFieldLabel}>A LINE THAT SOUNDS LIKE YOU</Text>
            <Text style={styles.headlineCounter}>
              {headline.length}/{HEADLINE_MAX}
            </Text>
          </View>
          <TextInput
            style={styles.headlineInput}
            value={headline}
            onChangeText={t => setHeadline(t)}
            multiline
            maxLength={HEADLINE_MAX}
            placeholderTextColor={T.mute}
          />
        </View>

        {/* PROMPTS section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>PROMPTS</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.addPromptText}>Add prompt</Text>
          </TouchableOpacity>
        </View>
        {PROMPTS.map((p, i) => (
          <PromptCard key={i} question={p.question} answer={p.answer} />
        ))}

        {/* VOICE INTRO section */}
        <Text style={styles.sectionLabel}>VOICE INTRO</Text>
        <View style={styles.voiceRow}>
          <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
            <PlayIcon />
          </TouchableOpacity>
          <View style={styles.voiceMiddle}>
            <Text style={styles.voiceLabel}>Voice intro · 0:28</Text>
            <WaveformViz />
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.reRecordText}>Re-record</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Save Button */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveButtonText}>Save about</Text>
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

  /* TopBar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  topBarBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 64,
  },
  topBarBackText: {
    fontSize: 15,
    color: T.ink,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: T.ink,
  },
  topBarSave: {
    minWidth: 64,
    alignItems: 'flex-end',
  },
  topBarSaveText: {
    fontSize: 15,
    color: T.accent,
    fontWeight: '600',
  },

  /* Content */
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  /* Section labels */
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: T.mute,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  addPromptText: {
    fontSize: 14,
    color: T.accent,
    fontWeight: '600',
  },

  /* Headline field */
  headlineField: {
    borderWidth: 1.5,
    borderColor: T.accent,
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  headlineLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headlineFieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: T.mute,
  },
  headlineCounter: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: T.mute,
  },
  headlineInput: {
    fontSize: 15,
    color: T.ink,
    lineHeight: 22,
    textAlignVertical: 'top',
    minHeight: 48,
    padding: 0,
  },

  /* Prompt cards */
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(42,39,35,0.16)',
    marginBottom: 10,
  },
  promptCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  promptQuestion: {
    flex: 1,
    fontFamily: FONTS.display,
    fontSize: 14,
    fontStyle: 'italic',
    color: T.accent,
    lineHeight: 20,
  },
  promptAnswer: {
    fontSize: 14,
    color: T.ink,
    lineHeight: 21,
  },

  /* Voice intro */
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(42,39,35,0.16)',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  voiceMiddle: {
    flex: 1,
  },
  voiceLabel: {
    fontSize: 12,
    color: T.mute,
    marginBottom: 6,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 40,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 3,
  },
  reRecordText: {
    fontSize: 13,
    color: T.accent,
    fontWeight: '600',
    flexShrink: 0,
  },

  /* Sticky footer */
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: T.accent,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
