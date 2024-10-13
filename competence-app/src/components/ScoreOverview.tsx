'use client';

import React from 'react';

// Define the structure expected for the processed data
interface ProcessedReportCatalogue {
    description: string;
    labels: string[];
    labelImages: string[];
    data: number[];
}

interface ScoreOverviewProps {
    reportCatalogues: ProcessedReportCatalogue[]; // Updated prop type
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({ reportCatalogues }) => {
    return (
        <div className="print-footer-scoreoverview">
            <h4>Score Overview</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {reportCatalogues.flatMap((catalogue, index) => 
                        catalogue.labels.map((label, idx) => {
                            const imageKey = catalogue.labelImages[idx]; // Corresponding image for the label
                            const data = catalogue.data[idx]; // Corresponding data for the label

                            return (
                                <tr key={`${index}-${idx}`}>
                                    <td>
                                        <span>
                                            <img 
                                                src={imageKey} 
                                                alt={label} 
                                                style={{ width: '20px', height: '20px', marginRight: '5px' }} 
                                            />
                                            {label}
                                        </span>
                                    </td>
                                    <td>{data.toFixed(2)}%</td> {/* Display the percentage data */}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreOverview;
