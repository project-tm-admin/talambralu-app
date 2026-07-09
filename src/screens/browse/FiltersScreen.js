/**
 * Filters Screen — new app-ui-main UI + Firebase backend
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { useApp } from '../../store/AppContext';

const GOLD  = '#C8920A';
const GOLD_S = '#FEF3D4';

const VISA_OPTIONS   = ['H1B', 'H4 EAD', 'L1', 'Green Card', 'Citizen', 'F1', 'OPT'];
const DIET_OPTIONS   = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'];
const RELIG_OPTIONS  = ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Buddhist', 'Jain', 'Other'];
const FIELD_OPTIONS  = ['Software', 'Medicine', 'Finance', 'Engineering', 'Academia', 'Law', 'Business'];
const MARITAL_OPTIONS = ['Never Married', 'Divorced', 'Widowed', 'Separated'];
const EDU_OPTIONS    = ['Bachelors', 'Masters', 'PhD', 'Medical', 'MBA', 'Other'];

// ─── Icons ────────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 5l-7 7 7 7" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function ChevronIcon({ open }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d={open ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────
function FilterRow({ label, value, onToggle }) {
  return (
    <View style={fs.row}>
      <Text style={fs.rowLabel}>{label}</Text>
      <Switch
        value={!!value}
        onValueChange={onToggle}
        trackColor={{ false: T.hair, true: T.accent }}
        thumbColor="#fff"
        ios_backgroundColor={T.hair}
      />
    </View>
  );
}

function RangeRow({ label, min, max, value, onChange }) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(null); // 'from' | 'to'

  function pick(n) {
    if (picking === 'from') onChange([n, Math.max(n, value[1])]);
    else onChange([Math.min(n, value[0]), n]);
    setOpen(false);
    setPicking(null);
  }

  return (
    <View style={fs.row}>
      <Text style={fs.rowLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity style={fs.rangePill} onPress={() => { setOpen(true); setPicking('from'); }}>
          <Text style={fs.rangePillText}>{value[0]}</Text>
        </TouchableOpacity>
        <Text style={{ color: T.mute, fontSize: 13 }}>–</Text>
        <TouchableOpacity style={fs.rangePill} onPress={() => { setOpen(true); setPicking('to'); }}>
          <Text style={fs.rangePillText}>{value[1]}</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => { setOpen(false); setPicking(null); }}>
        <Pressable style={fs.modalOverlay} onPress={() => { setOpen(false); setPicking(null); }}>
          <View style={fs.modalBox}>
            <Text style={fs.modalTitle}>Select {picking === 'from' ? 'Min' : 'Max'} {label}</Text>
            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              {steps.map(n => (
                <TouchableOpacity key={n} style={fs.modalOption} onPress={() => pick(n)}>
                  <Text style={[fs.modalOptionText, (picking === 'from' ? n === value[0] : n === value[1]) && fs.modalOptionActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function MultiChip({ options, selected, onChange, label }) {
  const [open, setOpen] = useState(false);
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(x => x !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <View style={fs.chipSection}>
      <TouchableOpacity style={fs.chipSectionHeader} onPress={() => setOpen(v => !v)}>
        <Text style={fs.rowLabel}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {selected.length > 0 && (
            <View style={fs.selectedCount}><Text style={fs.selectedCountText}>{selected.length}</Text></View>
          )}
          <ChevronIcon open={open} />
        </View>
      </TouchableOpacity>
      {open && (
        <View style={fs.chipList}>
          {options.map(opt => {
            const active = selected.includes(opt);
            return (
              <TouchableOpacity key={opt} style={[fs.chip, active && fs.chipActive]} onPress={() => toggle(opt)}>
                <Text style={[fs.chipText, active && fs.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function FiltersScreen() {
  const navigation = useNavigation();
  const { searchFilters, setSearchFilters } = useApp();

  const f = searchFilters || {};

  function update(key, val) {
    setSearchFilters?.({ ...f, [key]: val });
  }

  function reset() {
    setSearchFilters?.({});
  }

  const activeCount = Object.keys(f).filter(k => {
    const v = f[k];
    if (Array.isArray(v)) return v.length > 0;
    return !!v;
  }).length;

  return (
    <SafeAreaView style={fs.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={fs.header}>
        <TouchableOpacity style={fs.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={fs.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={reset}>
          <Text style={fs.resetText}>Reset{activeCount > 0 ? ` (${activeCount})` : ''}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={fs.scroll}>

        {/* Age */}
        <View style={fs.group}>
          <Text style={fs.groupLabel}>AGE RANGE</Text>
          <RangeRow
            label="Age" min={18} max={60}
            value={f.ageRange || [24, 40]}
            onChange={v => update('ageRange', v)}
          />
        </View>

        {/* Height */}
        <View style={fs.group}>
          <Text style={fs.groupLabel}>HEIGHT (CM)</Text>
          <RangeRow
            label="Height" min={140} max={210}
            value={f.heightRange || [155, 185]}
            onChange={v => update('heightRange', v)}
          />
        </View>

        {/* Toggle filters */}
        <View style={fs.group}>
          <Text style={fs.groupLabel}>PREFERENCES</Text>
          <FilterRow label="Face Verified Only" value={f.isFaceVerified}   onToggle={v => update('isFaceVerified', v)} />
          <FilterRow label="Same Community"       value={f.sameCaste}        onToggle={v => update('sameCaste', v)} />
          <FilterRow label="US-based Only"        value={f.usBasedOnly}      onToggle={v => update('usBasedOnly', v)} />
          <FilterRow label="With Photos"          value={f.hasPhotos}        onToggle={v => update('hasPhotos', v)} />
          <FilterRow label="With Horoscope"       value={f.hasHoroscope}     onToggle={v => update('hasHoroscope', v)} />
          <FilterRow label="Non-smoker Only"      value={f.nonSmoker}        onToggle={v => update('nonSmoker', v)} />
          <FilterRow label="Non-drinker Only"     value={f.nonDrinker}       onToggle={v => update('nonDrinker', v)} />
        </View>

        {/* Multi-select chips */}
        <View style={fs.group}>
          <Text style={fs.groupLabel}>DETAILS</Text>
          <MultiChip label="Visa Status"     options={VISA_OPTIONS}    selected={f.visaStatuses  || []} onChange={v => update('visaStatuses', v)} />
          <MultiChip label="Diet"            options={DIET_OPTIONS}    selected={f.diets         || []} onChange={v => update('diets', v)} />
          <MultiChip label="Religion"        options={RELIG_OPTIONS}   selected={f.religions     || []} onChange={v => update('religions', v)} />
          <MultiChip label="Field of Work"   options={FIELD_OPTIONS}   selected={f.fieldsOfWork  || []} onChange={v => update('fieldsOfWork', v)} />
          <MultiChip label="Marital Status"  options={MARITAL_OPTIONS} selected={f.maritalStatus || []} onChange={v => update('maritalStatus', v)} />
          <MultiChip label="Education"       options={EDU_OPTIONS}     selected={f.education     || []} onChange={v => update('education', v)} />
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Sticky footer */}
      <View style={fs.footer}>
        <TouchableOpacity style={fs.showBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={fs.showBtnText}>Show Matches</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const fs = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.hair },
  backBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: T.hair, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerTitle: { flex: 1, fontFamily: FONTS.display, fontSize: 20, color: T.accent },
  resetText: { fontSize: 14, color: T.accent, fontWeight: '600' },

  group: { backgroundColor: '#fff', marginHorizontal: 14, marginTop: 14, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2 },
  groupLabel: { fontFamily: FONTS.mono, fontSize: 10, color: T.mute, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: T.hair },
  rowLabel: { fontSize: 14, color: T.ink, flex: 1 },

  rangePill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1.2, borderColor: T.accent, backgroundColor: GOLD_S },
  rangePillText: { fontSize: 14, fontWeight: '600', color: T.accent },

  chipSection: { borderBottomWidth: 1, borderBottomColor: T.hair, paddingVertical: 4 },
  chipSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  selectedCount: { width: 20, height: 20, borderRadius: 10, backgroundColor: T.accent, justifyContent: 'center', alignItems: 'center' },
  selectedCountText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  chipList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1.2, borderColor: T.hair, backgroundColor: '#F5F2EE' },
  chipActive: { backgroundColor: T.accent, borderColor: T.accent },
  chipText: { fontSize: 13, color: T.ink, fontWeight: '500' },
  chipTextActive: { color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: 240, maxHeight: 360 },
  modalTitle: { fontFamily: FONTS.display, fontSize: 16, color: T.accent, marginBottom: 12 },
  modalOption: { paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: T.hair },
  modalOptionText: { fontSize: 15, color: T.ink, textAlign: 'center' },
  modalOptionActive: { color: T.accent, fontWeight: '700' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: T.hair,
    paddingHorizontal: 16, paddingVertical: 10, paddingBottom: 24,
  },
  showBtn: { backgroundColor: T.accent, borderRadius: 100, paddingVertical: 15, alignItems: 'center' },
  showBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
