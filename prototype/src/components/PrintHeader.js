import React from 'react';

const PrintHeader = ({ config }) => (
  <div className="print-header-container"  >
    <div id="print-header-logo"  >
      <img src={config.logoImg} alt="Logo"  style={{ maxWidth: '100px', maxHeight: '50px' }}  />
    </div>
    <div id="print-header-schule">
      <h1>{config.schoolName}</h1>
    </div>
  </div>
);

export default PrintHeader;

 