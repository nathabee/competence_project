
'use client';

// Import necessary data for the mock
import catalogues from '../data/catalogues.json';
import eleves from '../data/eleves.json';
import niveaux from '../data/niveaux.json';
import pdflayouts from '../data/pdflayouts.json';
import shortreports from '../data/shortreports.json';
import reportsRaw from '../data/fullreports.json';
import scorerulepoints from '../data/scorerulepoints.json';
import tokenData from '../data/token.json';
import userme from '../data/userme.json';

import { Report } from '../../types/report';
import { ReportPatch } from '../../types/reportpatch';



interface ImageResponse {
  image_base64: string;
}

// Base64 conversion utility for client-side
const convertImageToBase64 = async (imagePath: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.src = imagePath;
    img.crossOrigin = 'anonymous'; // Handle cross-origin issues if applicable
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const base64String = canvas.toDataURL('image/png');
        resolve(base64String);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    img.onerror = reject;
  });
}
 
 


// Ensure that reports is correctly typed
const reports: Report[] = reportsRaw as Report[];

// Define types for the responses and request configs
interface AxiosResponse<T> {
  data: T;
}

interface AxiosRequestConfig {
  headers?: {
    Authorization?: string;
  };
}

 

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const axios = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    console.log('AXIOS Mocking GET url:', url);
    if (config) {
      console.log('GET config:', config);
    }

    if (url === `${apiUrl}/catalogues/`) return { data: catalogues as T };
    if (url === `${apiUrl}/eleves/`) return { data: eleves as T };
    if (url === `${apiUrl}/niveaux/`) return { data: niveaux as T };
    if (url === `${apiUrl}/pdf_layouts/`) return { data: pdflayouts as T };
    if (url === `${apiUrl}/shortreports/`) return { data: shortreports as T };
    if (url === `${apiUrl}/scorerulepoints/`) return { data: scorerulepoints as T };
    if (url === `${apiUrl}/token/`) return { data: tokenData as T };
    if (url === `${apiUrl}/users/me/`) return { data: userme as T };

    const reportsPattern = new RegExp(`^${apiUrl}/eleve/(\\d+)/reports/$`);
    const match = url.match(reportsPattern);

    if (match) {
      const eleveId = match[1];
      const filteredReports = reports.filter(report => report.eleve === parseInt(eleveId));
      return { data: filteredReports as T };
    }

    // Check if the URL ends with "/base64/" to apply image Base64 transformation 
    const base64Pattern = /\/base64\/$/;
    if (base64Pattern.test(url)) {
      const imagePathMap: Record<string, string> = {
        [`${apiUrl}/myimage/1/base64/`]: '/demo/media/competence/png/beebot.png',
        [`${apiUrl}/myimage/2/base64/`]: '/demo/media/competence/png/categorisation.png',
        [`${apiUrl}/myimage/3/base64/`]: '/demo/media/competence/png/couleur.png',
        [`${apiUrl}/myimage/4/base64/`]: '/demo/media/competence/png/histoire.png',
        [`${apiUrl}/myimage/5/base64/`]: '/demo/media/competence/png/nombre.png',
        [`${apiUrl}/myimage/6/base64/`]: '/demo/media/competence/png/phonologie.png',
        [`${apiUrl}/myimage/7/base64/`]: '/demo/media/competence/png/prenom.png',
        [`${apiUrl}/myimage/8/base64/`]: '/demo/media/competence/png/probleme.png',
        [`${apiUrl}/myimage/9/base64/`]: '/demo/media/competence/png/spacial.png',
        [`${apiUrl}/myimage/10/base64/`]: '/demo/media/competence/png/probleme.png',
        [`${apiUrl}/myimage/11/base64/`]: '/demo/media/competence/png/spacial.png',
      };

      const imagePath = imagePathMap[url];
      if (imagePath) {
        try {
          const base64Image = await convertImageToBase64(imagePath);
          const imageResponse: ImageResponse = {
            image_base64: base64Image,
          };
          return { data: imageResponse as T };
        } catch (error) {
          console.error(`Error converting image to Base64: ${imagePath}`, error);
          throw error;
        }
      } else {
        throw new Error(`Unknown image path for URL: ${url}`);
      }
    }

    // If no route matches
    throw new Error(`Unknown API route: ${url}`);
  },



 

  post: async <T>(url: string, data?: Report, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    if (config) {
      console.log('POST config:', config);
    }
    console.log('POST mock request received:', url);

    if (url === `${apiUrl}/token/`) {
      return { data: tokenData as T };
    }

    if (url === `${apiUrl}/fullreports/`) {
      return {
        data: {
          id: 7,
          eleve: data?.eleve,
          professeur: data?.professeur,
          pdflayout: data?.pdflayout,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          report_catalogues: data?.report_catalogues || [],
        } as T,
      };
    }

    throw new Error(`Unknown API route: ${url}`);
  },

  patch: async <T>(url: string, data?: ReportPatch, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    console.log('PATCH request URL:', url, 'Data:', data);
    if (config) {
      console.log('PATCH config:', config);
    }

    const reportIdMatch = url.match(/\/fullreports\/(\d+)\//);
    if (reportIdMatch) {
      const reportId = parseInt(reportIdMatch[1], 10);
      const existingReport = reports.find(report => report.id === reportId);
      if (!existingReport) {
        throw new Error(`Report with ID ${reportId} not found`);
      }

      const updatedReport: Report = JSON.parse(JSON.stringify(existingReport));

      if (data?.report_catalogues_data) {
        data.report_catalogues_data.forEach(cataloguePatch => {
          const catalogueToUpdate = updatedReport.report_catalogues.find(cat => cat.id === cataloguePatch.id);
          if (catalogueToUpdate) {
            cataloguePatch.resultats.forEach(resultatPatch => {
              const resultatToUpdate = catalogueToUpdate.resultats.find(res => res.id === resultatPatch.id);
              if (resultatToUpdate) {
                resultatPatch.resultat_details.forEach(detailPatch => {
                  const detailToUpdate = resultatToUpdate.resultat_details.find(det => det.id === detailPatch.id);
                  if (detailToUpdate) {
                    detailToUpdate.score = detailPatch.score;
                    detailToUpdate.scorelabel = detailPatch.scorelabel;
                    detailToUpdate.observation = detailPatch.observation;
                  }
                });
              }
            });
          }
        });
      }

      return { data: updatedReport as T };
    }

    throw new Error(`Unknown PATCH API route: ${url}`);
  },
};

export default axios;



