 // src/components/UserDisplay.tsx
 'use client';
 
import React from 'react';
import { User } from '@/types/user'; // Import User interface
import useTranslation from '@/utils/translationHelper';

interface UserDisplayProps {
  user?: User | null; // user is optional and can be null
}

const UserDisplay: React.FC<UserDisplayProps> = ({ user }) => {
  const  t  = useTranslation();
  if (!user) {
    return <p>{t('msg_noUserData')}</p>; // Handle case when user is not passed
  }

  return (
    <div> {user.first_name} {user.last_name} {t('tab_id')}: {user.username} {t('tab_lang')}: {user.lang} {t('tab_roles')}: {user.roles.join(', ')}
    </div>
  );
};

export default UserDisplay;
