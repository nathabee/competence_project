'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import Spinner from 'react-bootstrap/Spinner';
import { getTokenFromCookies } from '@/utils/jwt';  
 

export default function AdminPage() { 
    const router = useRouter(); 
    // Use useEffect to set the token client-side only
    useEffect(() => {
        const token = getTokenFromCookies();
        if (!token  ) {
            router.push(`/login`);
        }  else {
            // Redirect to the Django admin console
            //const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://127.0.0.1:8000/admin/';
            //window.location.href = `${adminUrl}?token=${token}`; // Redirect to admin with the token
            document.cookie = `authToken=${token}; path=/; Secure; HttpOnly`; // Secure cookie settings
                
            // Step 3: Redirect to the Django admin console
            const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://127.0.0.1:8000/admin/';
            // This part assumes you can access the admin without a username/password
            window.location.href = adminUrl; // Redirect to admin URL
        }
    }, [router]); //[router,token,logout ]);

 

    return <div>Redirection vers console d&apos;administration...</div>; // Optional loading state
}