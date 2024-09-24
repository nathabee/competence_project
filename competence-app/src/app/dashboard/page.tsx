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
        <h2>this is my dashboard, reflect active  contexte </h2>
        <ul>
          <li>Teacher (user information)</li>
          <ul>
            <li>nom</li>
          </ul>
          <li>Catalogue</li>
          <ul>
            <li>annee</li>
            <li>niveau</li>
            <li>etape</li>
          </ul>
          <li>Schuler (depending on the teacher)</li>
          <ul>
            <li>nom</li>
            <li>prenom</li>
            <li>ecole</li>
            <li>date de naissance</li>
          </ul>
          <ul>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
            <li>la la la </li>
          </ul>
        </ul>
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
