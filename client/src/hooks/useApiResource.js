import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';

export function useApiResource(endpoint, { immediate = true, initialData = [] } = {}) {
  const initialRef = useRef(initialData);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState('');

  const fetchResource = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(endpoint);
      setData(res?.data ?? initialRef.current);
    } catch (err) {
      setError(err?.message || 'Unable to load content from server.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (immediate) {
      fetchResource();
    }
  }, [immediate, fetchResource]);

  return { data, setData, loading, error, refetch: fetchResource };
}
