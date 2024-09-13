import React, { useState, useEffect } from 'react';

const Config = ({ config, setConfig, defaultConfig }) => {
  const [tempConfig, setTempConfig] = useState(config);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setTempConfig(config);
  }, [config]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempConfig(prevConfig => ({ ...prevConfig, [name]: value }));
    setIsDirty(true);
  };

  const handleOpenFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const newConfig = JSON.parse(event.target.result);
          setTempConfig(newConfig);
          setIsDirty(true);
        } catch (error) {
          console.error('Invalid JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    setConfig(tempConfig);
    setIsDirty(false);
    console.log('Configuration saved:', tempConfig);
  };

  const handleReset = () => {
    setTempConfig(defaultConfig);
    setIsDirty(false);
    console.log('Configuration reset:', defaultConfig);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tempConfig, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('Configuration exported:', tempConfig);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ''; // For most browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <div>
      <h2>Configuration</h2>
      <div>
        <label>School Name: </label>
        <input
          type="text"
          name="schoolName"
          value={tempConfig.schoolName || ''}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label>Logo URL: </label>
        <input
          type="text"
          name="logoURL"
          value={tempConfig.logoURL || ''}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        />
      </div>
      <div>


      <div className="d-flex">
        <button className="btn btn-primary" onClick={handleSave}>Sauvegarder</button>
        <input className="btn btn-primary"  type="file" accept="application/json" onChange={handleOpenFile} />
        <button className="btn btn-primary" onClick={handleReset}>Remettre aux parametres usine</button>
        <button className="btn btn-primary" onClick={handleExport}>Export des donnees visualisee</button>
      </div>
      </div>
    </div>
  );
};

export default Config;









/*import React, { useState } from 'react';

const Config = ({ config, setConfig, defaultConfig }) => {
  const [tempConfig, setTempConfig] = useState(config);

  // Update tempConfig when the initial config changes
  React.useEffect(() => {
    setTempConfig(config);
  }, [config]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempConfig(prevConfig => ({ ...prevConfig, [name]: value }));
  };

  // Handle opening and parsing a JSON config file
  const handleOpenFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const newConfig = JSON.parse(event.target.result);
          setTempConfig(newConfig); // Update temp config with file content
        } catch (error) {
          console.error('Invalid JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Save changes to the config
  const handleSave = () => {
    setConfig(tempConfig);
    console.log('Configuration saved:', tempConfig);
  };

  // Reset to default config (from the passed prop)
  const handleReset = () => {
    setTempConfig(defaultConfig);
    console.log('Configuration reset:', defaultConfig);
  };

  // Save and export the config to a file
  const handleExport = () => {
    const dataStr = JSON.stringify(tempConfig, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.json';
    document.body.appendChild(link); // Append to body
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Revoke the URL after the click
    console.log('Configuration exported:', tempConfig);
  };

  return (
    <div>
      <h2>Configuration</h2>
      <div>
        <label>School Name: </label>
        <input
          type="text"
          name="schoolName"
          value={tempConfig.schoolName || ''}
          onChange={handleInputChange}
          style={{ width: '100%' }} // Max width for input
        />
      </div>
      <div>
        <label>Logo URL: </label>
        <input
          type="text"
          name="logoURL"
          value={tempConfig.logoURL || ''}
          onChange={handleInputChange}
          style={{ width: '100%' }} // Max width for input
        />
      </div>
      <div>
        <button onClick={handleSave}>Sauvegarder</button>
        <input type="file" accept="application/json" onChange={handleOpenFile} />
        <button onClick={handleReset}>Remettre aux parametres usine</button>
        <button onClick={handleExport}>Export des donnees visualisee</button>
      </div>
    </div>
  );
};

export default Config; */

 