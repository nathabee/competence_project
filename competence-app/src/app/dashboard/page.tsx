'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ShortReport } from '@/types/shortreport';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isTokenExpired, getTokenFromCookies } from '@/utils/jwt';
import ShortReportDisplay from '@/components/ShortReportDisplay'; // Updated import for display component


const Dashboard: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [shortReports, setShortReports] = useState<ShortReport[]>([]);

  // Fetch reports from API
  const fetchData = useCallback(async () => {
    const token = getTokenFromCookies();
    if (!token || isTokenExpired(token)) {
      router.push(`/login`);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(`${apiUrl}/shortreports/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched short reports:', response.data);
      setShortReports(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="loading-indicator">
        <p>Chargement des données...</p>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <p>Erreur chargement des données. Essayez plus tard SVP.</p>;
  }

  return (
    <div className="container mt-3 ml-2">
      <h1>Historique</h1> 

      {/* Refresh Button */}
      <button onClick={fetchData} className="btn btn-primary mb-3">
         Rafraîchir les données
      </button>

      {/* Passing the fetched reports to ShortReportDisplay */}
      <ShortReportDisplay reports={shortReports} />
    </div>
  );
};

export default Dashboard;