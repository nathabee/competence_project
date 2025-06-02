import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { ReportCatalogue, ResultatDetail, ScoreRulePoint } from '@/types/report';
import { ReportCataloguePatch, ResultatPatch } from '@/types/reportpatch';
import { getTokenFromCookies } from '@/utils/jwt';
import useTranslation from '@/utils/translationHelper';


const TestCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { activeReport, scoreRulePoints, activeEleve, user, setActiveReport } = useAuth();
    const [reportData, setReportData] = useState<ReportCatalogue[]>([]);
    const [isModified, setIsModified] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const  t  = useTranslation();

    const defaultScoreRulePoint = useMemo(() => ({
        id: 1,
        scorerule: 1,
        scorelabel: "?",
        score: -1,
        description: "Default score rule"
    }), []);

    useEffect(() => {
        if (activeReport) {
            setReportData(activeReport.report_catalogues || []);
            // Initialize isModified as an array with a length matching all `resultats` in all `report_catalogues`
            const modifiedArray = activeReport.report_catalogues.flatMap(
                (catalogue) => new Array(catalogue.resultats.length).fill(false)
            );
            setIsModified(modifiedArray);
        }
    }, [activeReport]);

    interface DetailIndex {
        catalogueIndex: number;
        resultatIndex: number;
        detailIndex: number;
    }

    const detailIndices: DetailIndex[] = useMemo(() => {
        const indices: DetailIndex[] = [];
        reportData.forEach((reportCatalogue, catalogueIndex) => {
            reportCatalogue.resultats.forEach((resultat, resultatIndex) => {
                resultat.resultat_details.forEach((_, detailIndex) => {
                    indices.push({ catalogueIndex, resultatIndex, detailIndex });
                });
            });
        });
        return indices;
    }, [reportData]);

    const currentDetailIndex = detailIndices[currentIndex] || {};
    const { catalogueIndex = 0, resultatIndex = 0, detailIndex = 0 } = currentDetailIndex;

    const currentDetail = reportData[catalogueIndex]?.resultats[resultatIndex]?.resultat_details[detailIndex];

    const updateIsModified = (catalogueIndex: number, resultatIndex: number) => {
        const flatIndex = reportData
            .slice(0, catalogueIndex)
            .reduce((acc, cat) => acc + cat.resultats.length, 0) + resultatIndex;

        setIsModified((prev) => {
            const newModified = [...prev];
            newModified[flatIndex] = true;
            return newModified;
        });
    };

    const handleObservationChange = (value: string) => {
        setReportData((prevData) => {
            const newData = [...prevData];
            newData[catalogueIndex].resultats[resultatIndex].resultat_details[detailIndex].observation = value;
            updateIsModified(catalogueIndex, resultatIndex);
            return newData;
        });
    };

    const handleScoreLabelChange = (selectedLabel: string, scorerule: number) => {
        const scoreRulePoint = scoreRulePoints?.find(
            (srp: ScoreRulePoint) => srp.scorerule === scorerule && srp.scorelabel === selectedLabel
        ) || defaultScoreRulePoint;

        setReportData((prevData) => {
            const newData = [...prevData];
            const detail = newData[catalogueIndex].resultats[resultatIndex].resultat_details[detailIndex];
            detail.scorelabel = selectedLabel;
            detail.score = detail.item.scorerule === 8 ? parseInt(selectedLabel, 10) : scoreRulePoint.score;
            if (detail.score > detail.item.max_score) {
                detail.score = Math.min(detail.score, detail.item.max_score);
            }
            updateIsModified(catalogueIndex, resultatIndex);
            return newData;
        });
    };

    const handleSaveResultat = async (catalogueIndex: number, resultatIndex: number) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const patchData: ReportCataloguePatch = { id: reportData[catalogueIndex].id, resultats: [] };
        const resultat = reportData[catalogueIndex].resultats[resultatIndex];
        const resultatPatch: ResultatPatch = { id: resultat.id, resultat_details: [] };

        resultat.resultat_details.forEach((detail: ResultatDetail) => {
            resultatPatch.resultat_details.push({
                id: detail.id,
                item_id: detail.item.id,
                score: detail.score,
                scorelabel: detail.scorelabel,
                observation: detail.observation,
            });
        });
        patchData.resultats.push(resultatPatch);
        setLoading(true);
        setIsError(false);

        try {
            const response = await axios.patch(`${apiUrl}/fullreports/${activeReport?.id}/`, {
                id: activeReport?.id || 0,
                eleve: activeEleve?.id || 0,
                professeur: user?.id || 0,
                pdflayout: 1,
                report_catalogues_data: [patchData],
            }, {
                headers: { Authorization: `Bearer ${getTokenFromCookies()}` },
            });

            setIsModified((prev) => {
                const flatIndex = reportData
                    .slice(0, catalogueIndex)
                    .reduce((acc, cat) => acc + cat.resultats.length, 0) + resultatIndex;
                const newModified = [...prev];
                newModified[flatIndex] = false;
                return newModified;
            });
            setActiveReport(response.data);
        } catch (error) {
            setIsError(true);
            console.error('Error updating report:', error);
        } finally {
            setLoading(false);
        }
    };



    // Use Effect to check if we are at the last detail and if it's modified
    useEffect(() => {
        const isLastDetail =
            reportData[catalogueIndex]?.resultats[resultatIndex]?.resultat_details?.length === detailIndex + 1;

        const flatIndex = reportData
            .slice(0, catalogueIndex)
            .reduce((acc, cat) => acc + cat.resultats.length, 0) + resultatIndex;

        if (isModified[flatIndex] && isLastDetail) {
            console.log("handleSaveResultat modified and last detail");
            handleSaveResultat(catalogueIndex, resultatIndex);
        }
    }, [reportData, isModified, catalogueIndex, resultatIndex, detailIndex]);



    const nextTest = () => {
        if (currentIndex < detailIndices.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevTest = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div>
            {currentDetail && scoreRulePoints && (
                <div>
                    <h3>{t('tbH_typeTest')}: {reportData[catalogueIndex]?.catalogue.description}</h3>
                    <h4>{t('tbH_resultat')}: {reportData[catalogueIndex].resultats[resultatIndex]?.groupage.desc_groupage}</h4>
                    <p>{t('tbH_test')}: {currentDetail.item.description}</p>
                    <p>{t('tbH_score')}  {t('tbH_MaxScore')}: {currentDetail.item.max_score}</p>

                    <input
                        type="number"
                        value={currentDetail.score}
                        onChange={(e) => handleScoreLabelChange(e.target.value, currentDetail.item.scorerule)}
                    />

                    <select
                        value={currentDetail.scorelabel || defaultScoreRulePoint.scorelabel}
                        onChange={(e) => handleScoreLabelChange(e.target.value, currentDetail.item.scorerule)}
                    >
                        {currentDetail.item.scorerule === 8 ? (
                            Array.from({ length: currentDetail.item.max_score + 1 }, (_, i) => (
                                <option key={i} value={i}>{i}</option>
                            ))
                        ) : (
                            scoreRulePoints
                                .filter((srp) => srp.scorerule === currentDetail.item.scorerule)
                                .map((srp) => (
                                    <option key={srp.id} value={srp.scorelabel}>{srp.scorelabel}</option>
                                ))
                        )}
                    </select>

                    <input
                        type="text"
                        value={currentDetail.observation}
                        onChange={(e) => handleObservationChange(e.target.value)}
                    />
 

                    <div className="carousel-navigation">
                        <button onClick={prevTest} disabled={currentIndex === 0}>{t('nav_back')}</button>
                        <button onClick={nextTest} disabled={currentIndex === detailIndices.length - 1}>{t('nav_next')}</button>
 
                    </div>
                </div>
            )}

            {loading && <p>{t('msg_load')}</p>}
            {isError && <p>{t('msg_err_sav')}</p>}
        </div>
    );
};

export default TestCarousel;
