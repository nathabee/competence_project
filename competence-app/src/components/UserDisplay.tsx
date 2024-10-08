 // src/components/UserDisplay.tsx
 'use client';
 
import React from 'react';
import { User } from '@/types/user'; // Import User interface

interface UserDisplayProps {
  user?: User | null; // user is optional and can be null
}

const UserDisplay: React.FC<UserDisplayProps> = ({ user }) => {
  if (!user) {
    return <p>No user information available.</p>; // Handle case when user is not passed
  }

  return (
    <div>
      <h3>{user.first_name} {user.last_name}</h3>
      <p>Username: {user.username}</p>
      <p>Roles: {user.roles.join(', ')}</p>
    </div>
  );
};

export default UserDisplay;
