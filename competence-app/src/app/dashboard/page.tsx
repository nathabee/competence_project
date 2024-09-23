'use client'; // Mark this as a Client Component
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
  const router = useRouter();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/evaluation';

  useEffect(() => {


    const token = document.cookie.split('authToken=')[1];
    if (!token) {
      router.push(`/login`);
    }
  }, [router, basePath]);

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>


      <div className="tab-content mt-3">
        {/* Dynamic routing will load here based on tab selection */}
      </div>
    </div>
  );
};

export default Dashboard;

/*
      <!-- ul className="nav nav-tabs">
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push(`${basePath}/dashboard/overview`)}>Overview</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push(`${basePath}/dashboard/configuration`)}>Configuration</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push(`${basePath}/dashboard/pdf`)}>PDF</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push(`${basePath}/dashboard/result`)}>Result</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push(`${basePath}/dashboard/test`)}>Test</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push(`${basePath}/dashboard/admin`)}>Administration</a>
        </li>
      </ul -->*/
