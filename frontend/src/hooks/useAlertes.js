import { useState, useEffect } from 'react';
import { fetchAlertes } from '../api/medicamentsApi';

export const useAlertes = () => {
  const [alertes, setAlertes]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAlertes();
        setAlertes(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { alertes, loading, error };
};