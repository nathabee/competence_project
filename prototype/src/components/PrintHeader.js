import React from 'react';
import logo from '../assets/logo.png'; // Adjust the path according to your project structure

const PrintHeader = () => (
  <div id="print-header-container">
    <div id="print-header-logo">
      <img src={logo} alt="Logo" style={{ maxWidth: '100px', maxHeight: '50px' }} />
    </div>
    <div id="print-header-schule">
      <h1>Enseignement Catholique des Cotes d'Armor</h1>
      <h1> </h1>
      <h1> </h1>
    </div>

  </div>
);

export default PrintHeader;
