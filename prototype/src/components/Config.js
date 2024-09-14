import React, { useState, useEffect } from 'react';
import GroupageData from './GroupageData';

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

    const handleGroupageChange = (index, field, value) => {
        const updatedGroupage = [...tempConfig.groupage_gs];
        updatedGroupage[index] = { ...updatedGroupage[index], [field]: value };
        setTempConfig(prevConfig => ({ ...prevConfig, groupage_gs: updatedGroupage }));
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
            <div className="form-group shadow-section">
            <h2>Configuration</h2>
                <div className="d-flex">
                    <button className="btn btn-primary" onClick={handleSave}>Sauver</button>
                    <input className="btn btn-primary" type="file" accept="application/json" onChange={handleOpenFile} />
                    <button className="btn btn-primary" onClick={handleReset}>Paramètres usine</button>
                    <button className="btn btn-primary" onClick={handleExport}>Export</button>
                </div>
            </div>
            <div className="form-group shadow-section">
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
                    <label>Message en bas du PDF - Footer Titre: </label>
                    <input
                        type="text"
                        name="footerPDFTitre"
                        value={tempConfig.footerPDFTitre || ''}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                    />
                </div>


                <div>
                    <label>Message en bas du PDF - Footer Message 1: </label>
                    <input
                        type="text"
                        name="footerPDFMessage1"
                        value={tempConfig.footerPDFMessage1 || ''}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                    />
                </div>


                <div>
                    <label>Message en bas du PDF - Footer Message 2: </label>
                    <input
                        type="text"
                        name="footerPDFMessage2"
                        value={tempConfig.footerPDFMessage2 || ''}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                    />
                </div>

              </div>
            <div className="form-group shadow-section">
                {/* Groupage Data Section */}
                <GroupageData groupage_gs={tempConfig.groupage_gs} onGroupageChange={handleGroupageChange} />

            </div>

        </div>
    );
};

export default Config;
