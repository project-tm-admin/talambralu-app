/**
 * useDiscoveryFilters — queries Firestore profiles for the Search/Discover tab
 * Applies filters client-side after fetching a batch of 50 profiles.
 */
import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useApp } from '../store/AppContext';

function getAge(dob) {
  if (!dob) return null;
  const b = new Date(dob);
  if (isNaN(b.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

function applyClientFilters(profiles, f) {
  let out = profiles;
  if (f.isVerified) out = out.filter(p => p.isFaceVerified);
  if (f.keywords) {
    const kw = f.keywords.toLowerCase();
    out = out.filter(p =>
      (p.fullName || '').toLowerCase().includes(kw) ||
      (p.city || '').toLowerCase().includes(kw) ||
      (p.jobTitle || '').toLowerCase().includes(kw)
    );
  }
  if (f.minAge != null) out = out.filter(p => { const a = getAge(p.dob); return a == null || a >= f.minAge; });
  if (f.maxAge != null) out = out.filter(p => { const a = getAge(p.dob); return a == null || a <= f.maxAge; });
  if (f.religion && f.religion !== 'Any') out = out.filter(p => p.religion === f.religion);
  if (f.visa && f.visa !== 'Any') out = out.filter(p => p.visaStatus === f.visa);
  return out;
}

export function useDiscoveryFilters() {
  const { user } = useApp();
  const [filters, setFilters] = useState({});
  const [allProfiles, setAllProfiles] = useState([]);
  const [results, setResults] = useState([]);
  const [shortlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'profiles'), where('onboardingComplete', '==', true), limit(50))
      );
      const profiles = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.uid !== user.uid);
      setAllProfiles(profiles);
      setResults(profiles);
    } catch (e) {
      console.error('Discovery fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => {
      const merged = { ...prev, ...newFilters };
      setResults(applyClientFilters(allProfiles, merged));
      return merged;
    });
  }, [allProfiles]);

  return { filters, applyFilters, results, shortlist, loading };
}
