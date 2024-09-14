import React from 'react';

const PrintHeader = ({ config }) => (
  <div className="print-header-container"  >
    <div id="print-header-logo"  >
      <img src={config.logoURL} alt="Logo" style={{ width: 'auto', height: '40px' }} />
    </div>
    <div id="print-header-schule">
      <h1>{config.schoolName}</h1>
    </div>
  </div>
);

export default PrintHeader;

 