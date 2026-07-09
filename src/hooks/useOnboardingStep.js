/**
 * useOnboardingStep
 *
 * Thin wrapper around updateUserDoc that:
 *  - injects the current user's uid automatically
 *  - manages a saving/error state for the Continue button
 *  - returns { save, saving, error }
 *
 * Usage:
 *   const { save, saving } = useOnboardingStep();
 *   // on Continue:
 *   await save({ gender: 'Woman', lookingFor: 'Men' });
 *   navigation.navigate('NextScreen');
 */
import { useState, useCallback } from 'react';
import { useApp } from '../store/AppContext';
import { updateUserProfile } from '../firebase/firestore';

export default function useOnboardingStep() {
  const { firebaseUser } = useApp();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  // Saves all fields under users/{uid}/profile.* so matchScore + MyProfileScreen
  // can read them consistently via userDoc.profile
  const save = useCallback(async (data) => {
    if (!firebaseUser?.uid) return;
    setSaving(true);
    setError(null);
    try {
      await updateUserProfile(firebaseUser.uid, data);
    } catch (e) {
      setError(e.message);
      console.error('onboarding save error:', e.message);
      throw e; // let caller decide whether to still navigate
    } finally {
      setSaving(false);
    }
  }, [firebaseUser]);

  return { save, saving, error };
}
