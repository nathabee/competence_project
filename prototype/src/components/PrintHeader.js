import React from 'react';

const PrintHeader = ({ config }) => (
  <div id="print-header-container"  >
    <div id="print-header-logo"  >
      <img src={config.logoURL} alt="Logo" style={{ width: 'auto', height: '40px' }} />
    </div>
    <div id="print-header-schule">
      <h1>{config.schoolName}</h1>
    </div>
  </div>
);

export default PrintHeader;



/*
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
*/ 

/*
const PrintHeader = () => (
  <div id="print-header-container" style={{ 
    width: '100%', 
    height: 'auto', 
    backgroundImage: `url(${banner})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    padding: '20px',
    color: 'white' // Change this as needed based on your banner image
  }}>
 
    <div id="print-header-logo" style={{ 
      position: 'absolute', 
      top: '20px', 
      left: '20px' 
    }}>
      <img src={logo} alt="Logo" style={{ maxWidth: '100px', maxHeight: '50px' }} />
    </div>
    <div id="print-header-schule" style={{ 
      textAlign: 'center',
      position: 'relative',
      top: '50%', 
      transform: 'translateY(-50%)' 
    }}>
      <h1>Enseignement Catholique des Cotes d'Armor</h1>
      <h1> </h1>
      <h1> </h1>
    </div> 
  </div>
);*/