'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

const Teacher: React.FC = () => {
  const { user } = useAuth(); // Access user from context

  if (!user) {
    return <p>No user information available.</p>; // Handle case when user is not available
  }

  return (
    <div>
      <h3>{user.first_name} {user.last_name}</h3>
      <p>Username: {user.username}</p>
      <p>Roles: {user.roles.join(', ')}</p>
    </div>
  );
};

export default Teacher;
