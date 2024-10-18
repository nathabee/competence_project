'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Import the Image component from Next.js
import { ReportCatalogue, Resultat } from '@/types/report'; // Ensure you import these types correctly

interface ScoreOverviewProps {
    reportCatalogue: ReportCatalogue; // Updated prop type
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({ reportCatalogue }) => {
    const [base64Images, setBase64Images] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Load base64 images from localStorage on the client side
        const images: { [key: string]: string } = {};

        reportCatalogue.resultats.forEach((resultat) => {
            const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`;
            //console.log("imageKey:",imageKey)
            const base64Image = localStorage.getItem(imageKey);
            //console.log("base64Image null?:",base64Image)
            if (base64Image) {
                images[imageKey] = base64Image;
            }
 


        });

        setBase64Images(images); // Set the loaded images into the state
    }, [reportCatalogue]);


    return (
        <div className="print-footer-scoreoverview">
            <h3>{reportCatalogue.description}</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Type de tests</th>
                        <th>Score</th>
                        <th>Maximum</th>
                        <th>%</th> 
                    </tr>
                </thead>
                <tbody>
                    {reportCatalogue.resultats.length > 0 ? (
                        reportCatalogue.resultats.map((resultat: Resultat, resIndex: number) => {
                            const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`;
                            const base64Image = base64Images[imageKey] || null; // Use base64 image from state
                            //console.log("scoreoverview imageKey",imageKey)
                            //console.log("scoreoverview base64Image",base64Image)

                            return (
                                <tr key={`${reportCatalogue.id}-${resIndex}`}>
                                    <td>{base64Image ? (
                                            <Image
                                                src={base64Image} // Use Base64 image if available
                                                alt="Groupage Icon"
                                                width={20}
                                                height={20}
                                                style={{ marginRight: '10px' }}
                                            />
                                        ) : null} {/* If no base64Image, render nothing */} {resultat.groupage.label_groupage}</td>
                                        <td>{resultat.score.toFixed(0)}</td>
                                        <td>{resultat.groupage.max_point.toFixed(0)}</td>
                                        <td>{Math.round((resultat.score / resultat.groupage.max_point) * 100)}%</td>

                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={10}>Pas de données disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreOverview;
