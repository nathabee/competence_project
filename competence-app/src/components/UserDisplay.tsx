 // src/components/UserDisplay.tsx
 'use client';
 
import React from 'react';
import { User } from '@/types/user'; // Import User interface

interface UserDisplayProps {
  user?: User | null; // user is optional and can be null
}

const UserDisplay: React.FC<UserDisplayProps> = ({ user }) => {
  if (!user) {
    return <p>Pas d&apos;information sur l&apos;utilisateur</p>; // Handle case when user is not passed
  }

  return (
    <div> {user.first_name} {user.last_name} Identifiant: {user.username} Language: {user.lang} Roles: {user.roles.join(', ')}
    </div>
  );
};

export default UserDisplay;
