import { useState, useEffect, useCallback } from 'react';
import { fetchVentes } from '../api/ventesApi';

export const useVentes = () => {
  const [ventes, setVentes]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVentes();
      setVentes(data.results || data);
    } catch (err) {
      setError(err.message || 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ventes, loading, error, reload: load };
};