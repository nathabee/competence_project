'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import Spinner from 'react-bootstrap/Spinner';

export default function AdminPage() { 
    const router = useRouter(); 

 
    useEffect(() => {
        const token = document.cookie.split('authToken=')[1]?.split(';')[0]; // Get token from cookies

        if (!token) {
            // If no token is found, redirect to the login page
            router.push('/login');
        } else {
            // Redirect to the Django admin console
            //const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://127.0.0.1:8000/admin/';
            //window.location.href = `${adminUrl}?token=${token}`; // Redirect to admin with the token
            document.cookie = `authToken=${token}; path=/; Secure; HttpOnly`; // Secure cookie settings
                
            // Step 3: Redirect to the Django admin console
            const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://127.0.0.1:8000/admin/';
            // This part assumes you can access the admin without a username/password
            window.location.href = adminUrl; // Redirect to admin URL
        }
    }, [router]);

    return <div>Redirecting to Admin...</div>; // Optional loading state
}