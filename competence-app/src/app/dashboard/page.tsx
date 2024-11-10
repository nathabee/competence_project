'use client';

import React, { useEffect, useState , useCallback} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ShortReport } from '@/types/shortreport';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  getTokenFromCookies } from '@/utils/jwt'; 
import ShortReportDisplay from '@/components/ShortReportDisplay'; // Updated import for display component
import useTranslation from '@/utils/translationHelper';


const Dashboard: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [shortReports, setShortReports] = useState<ShortReport[]>([]);
  const  t  = useTranslation(); // Hook to use translations

  // Fetch reports from API
  const fetchData = useCallback(async () => {
    const token = getTokenFromCookies(); // Get token from cookies

    if (!token) { // If there's no token or it's expired
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
        <p>{t("msg_load")}</p>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <p>{t("msg_loadErr")}</p>;
  }

  return (
    <div className="container mt-3 ml-2">
      <h1>{t("pgH_histo")}</h1> 

      {/* Refresh Button */}
      <button onClick={fetchData} className="btn btn-primary mb-3">
      {t("msg_refresh")}
      </button>

      {/* Passing the fetched reports to ShortReportDisplay */}
      <ShortReportDisplay reports={shortReports} />
    </div>
  );
};

export default Dashboard;