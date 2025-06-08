import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Eleve } from '@mytypes/eleve';
import { getToken , isTokenExpired } from '@utils/jwt'; 
import { getApiUrl } from '@utils/helper';

export const useStudents = () => {
  const [students, setStudents] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStudents = useCallback(async () => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${getApiUrl()}/eleves/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (e) {
      console.error('Error fetching students', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, error, setStudents, refetch: fetchStudents };
};
