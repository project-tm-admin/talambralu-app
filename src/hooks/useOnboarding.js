/**
 * useOnboarding — hook for all 14 onboarding screens
 *
 * Each screen calls:
 *   const { save, loading } = useOnboarding();
 *   await save({ name: 'Priya', dob: '1998-05-10' });
 *   navigation.navigate('NextScreen');
 *
 * On the last screen (Verify), call:
 *   await save({ isVerified: false });
 *   await complete();  // sets onboardingComplete = true
 */
import { useState } from 'react';
import { useApp } from '../store/AppContext';

export function useOnboarding() {
  const { updateProfile, completeOnboarding, userDoc } = useApp();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  async function save(profileFields) {
    setLoading(true);
    setError(null);
    try {
      await updateProfile(profileFields);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function complete(finalFields = {}) {
    setLoading(true);
    setError(null);
    try {
      if (Object.keys(finalFields).length > 0) {
        await updateProfile(finalFields);
      }
      await completeOnboarding();
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // Prefill from saved profile (useful when user resumes onboarding after app restart)
  const savedProfile = userDoc?.profile || {};

  return { save, complete, loading, error, savedProfile };
}
