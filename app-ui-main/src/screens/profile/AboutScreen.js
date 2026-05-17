import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Primary from '../../components/Primary';

const AI_CHIPS = ['Make it warmer', 'Make it shorter', 'Translate · తెలుగు', 'More poetic'];
const WAVEFORM_HEIGHTS = [16, 24, 32, 20, 40, 28, 36, 22, 44, 30, 38, 18, 42, 26, 34, 20, 48, 24, 38, 30];

function WaveformViz() {
  return (
    <View style={styles.waveRow}>
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <View
          key={i}
          style={[
            styles.waveBar,
            { height: h, backgroundColor: i < 12 ? T.accent : T.hair2 }
          ]}
        />
      ))}
    </View>
  );
}

function MicIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="11" rx="3" stroke={T.accent} strokeWidth={1.8} />
      <Path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function SparkleIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l2 7h7l-6 4 2 7-5-4-5 4 2-7L3 9h7z" stroke={T.accent} strokeWidth={1.5} fill={T.accentSoft} />
    </Svg>
  );
}

const PROMPT = 'What does "home" mean to you?';
const RESPONSE = `Home is the smell of my paati's kitchen in Vijayawada — turmeric, cardamom, and fresh jasmine through the window. It's also the hum of Bay Area freeway traffic on a Sunday morning, my chai going cold while I'm deep in a book. Home, I've learned, is something you carry — and something you build.`;

export default function AboutScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState(RESPONSE);

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Preferences')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={12} total={14} />
        <Text style={styles.title}>Tell your{'\n'}story</Text>
        <Text style={styles.subtitle}>A prompt you answer in your own words</Text>

        {/* Prompt card */}
        <View style={styles.promptCard}>
          <Text style={styles.promptQuestion}>{PROMPT}</Text>
          <TextInput
            style={styles.promptAnswer}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            placeholderTextColor={T.mute}
          />
        </View>

        {/* AI chips */}
        <View style={styles.aiRow}>
          <SparkleIcon />
          <View style={styles.aiChips}>
            {AI_CHIPS.map(chip => (
              <TouchableOpacity key={chip} style={styles.aiChip} activeOpacity={0.7}>
                <Text style={styles.aiChipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Voice intro */}
        <View style={styles.voiceCard}>
          <View style={styles.voiceHeader}>
            <MicIcon />
            <Text style={styles.voiceTitle}>Voice intro</Text>
            <View style={styles.voiceDuration}>
              <Text style={styles.voiceDurationText}>0:42</Text>
            </View>
          </View>
          <WaveformViz />
          <Text style={styles.voiceHint}>Tap the waveform to play · 12 seconds remaining</Text>
        </View>

        <Primary
          label="Continue"
          onPress={() => navigation.navigate('Preferences')}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: {
    fontFamily: FONTS.display,
    fontSize: 36,
    color: T.ink,
    lineHeight: 44,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: T.mute,
    marginBottom: 24,
  },
  promptCard: {
    backgroundColor: T.field,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  promptQuestion: {
    fontFamily: FONTS.display,
    fontSize: 16,
    fontStyle: 'italic',
    color: T.accent,
    marginBottom: 12,
  },
  promptAnswer: {
    fontFamily: FONTS.display,
    fontSize: 16,
    fontStyle: 'italic',
    color: T.ink2,
    lineHeight: 26,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 20,
  },
  aiChips: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  aiChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: T.accentSoft,
    backgroundColor: '#FFFFFF',
  },
  aiChipText: {
    fontSize: 12,
    color: T.accent,
    fontWeight: '500',
  },
  voiceCard: {
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 16,
    padding: 16,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  voiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: T.ink,
    flex: 1,
  },
  voiceDuration: {
    backgroundColor: T.field,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  voiceDurationText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: T.mute,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 10,
    height: 52,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 3,
  },
  voiceHint: {
    fontSize: 11,
    color: T.mute,
    textAlign: 'center',
  },
});
