// app/home/page.tsx
'use client';

import React from 'react'; 
 import useTranslation from '@/utils/translationHelper';




const HomePage: React.FC = () => { 
  const  t  = useTranslation(); // Hook to use translations

  return (
    <div className="container mt-3 ml-2">
      <h1>{t('welcome')}</h1> 
      <p>News : {t('news')}</p>
    </div>
  );
};

export default HomePage;
