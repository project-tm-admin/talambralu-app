import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';

function SectionLabel({ title }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function Field({ label, value, active }) {
  return (
    <View style={[styles.field, active && styles.fieldActive]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function ActiveField({ label, value, onChangeText }) {
  return (
    <View style={[styles.field, styles.fieldActive]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        autoFocus={false}
        selectionColor={T.accent}
      />
    </View>
  );
}

function IncomeField({ label, value, currency }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.incomeRow}>
        <Text style={styles.fieldValue}>{value}</Text>
        <Text style={styles.currencyText}>{currency}</Text>
      </View>
    </View>
  );
}

export default function EditCareerScreen() {
  const navigation = useNavigation();
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [showIncome, setShowIncome] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarLeft}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EDIT CAREER</Text>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionLabel title="EDUCATION" />

        <Field label="HIGHEST DEGREE" value="MS · Computer Science" />
        <Field label="UNIVERSITY" value="Carnegie Mellon" />

        <View style={styles.sectionGap} />
        <SectionLabel title="WORK" />

        <ActiveField
          label="JOB TITLE"
          value={jobTitle}
          onChangeText={setJobTitle}
        />
        <Field label="COMPANY" value="Stripe" />
        <Field label="WORK LOCATION" value="San Francisco, CA" />

        <View style={styles.sectionGap} />
        <SectionLabel title="INCOME" />

        <IncomeField
          label="ANNUAL INCOME"
          value="$150K – $200K"
          currency="USD"
        />

        <View style={styles.toggleField}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Show income on profile</Text>
            <Text style={styles.toggleSub}>Only verified members can see your range</Text>
          </View>
          <Switch
            value={showIncome}
            onValueChange={setShowIncome}
            trackColor={{ false: T.hair2, true: T.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save career</Text>
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

  // TopBar
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
  backText: {
    fontSize: 15,
    color: T.ink,
  },
  topBarTitle: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.4,
    color: T.ink,
    textAlign: 'center',
  },
  topBarRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 15,
    color: T.accent,
    fontWeight: '500',
  },

  // Content
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  sectionGap: {
    height: 20,
  },
  bottomPad: {
    height: 24,
  },

  // Section label
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  // Field
  field: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  fieldActive: {
    borderColor: T.accent,
    borderWidth: 1.5,
  },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: T.ink,
  },
  fieldInput: {
    fontSize: 15,
    color: T.ink,
    padding: 0,
    margin: 0,
  },

  // Income row
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyText: {
    fontSize: 13,
    color: T.mute,
  },

  // Toggle row
  toggleField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    fontSize: 15,
    color: T.ink,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 16,
  },

  // Sticky bottom
  stickyBottom: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: T.accent,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
