import { useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';

function getAgeFromDob(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function useDiscoveryFilters(initialState = {}) {
  const [filters, setFilters] = useState({
    minAge: 21,
    maxAge: 45,
    isVerified: false,
    keywords: '',
    ...initialState,
  });

  const [results, setResults] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const fetchResults = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const queryParts = [];
      if (filters.minAge != null) queryParts.push(`minAge=${filters.minAge}`);
      if (filters.maxAge != null) queryParts.push(`maxAge=${filters.maxAge}`);
      if (filters.isVerified) queryParts.push('isFaceVerified=true');
      if (filters.keywords) queryParts.push(`keywords=${encodeURIComponent(filters.keywords)}`);

      const queryString = queryParts.join('&');
      const discoveryEndpoint = queryString ? `/v1/discovery?${queryString}` : '/v1/discovery';
      const shortlistEndpoint = queryString ? `/v1/shortlist?${queryString}` : '/v1/shortlist';

      const [discoveryData, shortlistData] = await Promise.all([
        api.get(discoveryEndpoint, { signal }),
        api.get(shortlistEndpoint, { signal }).catch(() => ({ data: [] })),
      ]);

      if (signal?.aborted) return;

      setResults(discoveryData?.data || []);

      let filteredShortlist = shortlistData?.data || [];

      if (filters.isVerified) {
        filteredShortlist = filteredShortlist.filter(p => p.isFaceVerified || p.verified);
      }
      if (filters.minAge != null || filters.maxAge != null) {
        filteredShortlist = filteredShortlist.filter(p => {
          const age = p.dob ? getAgeFromDob(p.dob) : p.age;
          if (age == null) return true;
          if (filters.minAge != null && age < filters.minAge) return false;
          if (filters.maxAge != null && age > filters.maxAge) return false;
          return true;
        });
      }
      if (filters.keywords && filters.keywords.trim() !== '') {
        const lowerKeyword = filters.keywords.toLowerCase();
        filteredShortlist = filteredShortlist.filter(p =>
          p.fullName?.toLowerCase().includes(lowerKeyword) || p.name?.toLowerCase().includes(lowerKeyword)
        );
      }

      setShortlist(filteredShortlist);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Failed to fetch discovery results:', err);
      setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => fetchResults(controller.signal), 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [fetchResults]);

  const resetFilters = useCallback(() => {
    setFilters({
      minAge: 21,
      maxAge: 45,
      isVerified: false,
      keywords: '',
    });
  }, []);

  return {
    filters,
    applyFilters,
    resetFilters,
    results,
    shortlist,
    loading,
    error,
    refetch: fetchResults,
  };
}
