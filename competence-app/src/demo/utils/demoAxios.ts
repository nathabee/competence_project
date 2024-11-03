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
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

export const axios = { 
  // Handle GET requests
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    console.log('AXIOS Moking GET url:', url);
    if (config) {
      // Optionally, you could log the config to see if it's being passed
      console.log('GET config:', config);
    }
    // Mocking data based on the API route
    if (url === `${apiUrl}/catalogues/`) return { data: catalogues as T };
    if (url === `${apiUrl}/eleves/`) return { data: eleves as T };
    if (url === `${apiUrl}/niveaux/`) return { data: niveaux as T };
    if (url === `${apiUrl}/pdf_layouts/`) return { data: pdflayouts as T };
    if (url === `${apiUrl}/shortreports/`) return { data: shortreports as T };
    if (url === `${apiUrl}/scorerulepoints/`) return { data: scorerulepoints as T };
    if (url === `${apiUrl}/token/`) return { data: tokenData as T };
    if (url === `${apiUrl}/users/me/`) return { data: userme as T };

    // Add the GET endpoint for reports related to a specific eleve 
    const reportsPattern = new RegExp(`^${apiUrl}/eleve/(\\d+)/reports/$`); // Adjusted regex
    const match = url.match(reportsPattern);

    if (match) {
        const eleveId = match[1]; // Get the eleve ID from the URL
        // Optionally filter reports based on eleveId if your data structure requires it
        const filteredReports = reports.filter(report => report.eleve === parseInt(eleveId));
        return { data: filteredReports as T };
    }


    // Check if the URL is a Base64 image request
    const base64Pattern = /\/base64\/$/;
    if (base64Pattern.test(url)) {
      const imagePathMap: Record<string, string> = {
        [`${apiUrl}/myimage/1/base64/`]: `${mediaUrl}competence/png/beebot.png`,
        [`${apiUrl}/myimage/2/base64/`]: `${mediaUrl}competence/png/categorisation.png`,
        [`${apiUrl}/myimage/3/base64/`]: `${mediaUrl}competence/png/couleur.png`,
        [`${apiUrl}/myimage/4/base64/`]: `${mediaUrl}competence/png/histoire.png`,
        [`${apiUrl}/myimage/5/base64/`]: `${mediaUrl}competence/png/nombre.png`,
        [`${apiUrl}/myimage/6/base64/`]: `${mediaUrl}competence/png/phonologie.png`,
        [`${apiUrl}/myimage/7/base64/`]: `${mediaUrl}competence/png/prenom.png`,
        [`${apiUrl}/myimage/8/base64/`]: `${mediaUrl}competence/png/probleme.png`,
        [`${apiUrl}/myimage/9/base64/`]: `${mediaUrl}competence/png/spacial.png`,
        [`${apiUrl}/myimage/10/base64/`]: `${mediaUrl}competence/png/probleme.png`,
        [`${apiUrl}/myimage/11/base64/`]: `${mediaUrl}competence/png/spacial.png`,
      }; 

      console.log("debug moking api url ",url)
      console.log("decoded is ",imagePathMap[url])

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

  // Handle POST requests
  post: async <T>(url: string, data?: Report, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Mock data storage for demonstration purposes
    if (config) {
      // Optionally, you could log the config to see if it's being passed
      console.log('POST config:', config);
      }
  
     console.log('POST mock request received:', url);
 

    // Simulate token generation or validation
    if (url === `${apiUrl}/token/`) {
      // Normally, you'd handle token generation or validation here.
      console.log('Simulating token generation...');
      //const mockTokenResponse = {
      //  token: 'newMockGeneratedToken123', // This would be generated dynamically in a real API
      //};
      //return { data: mockTokenResponse as T };
      return { data:  tokenData as T };
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

  // Handle PATCH requests
  patch: async <T>(url: string, data?: ReportPatch, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    console.log('PATCH request URL:', url, 'Data:', data);
    if (config) {
      // Optionally, you could log the config to see if it's being passed
      console.log('GET config:', config);
    }

    const reportIdMatch = url.match(/\/fullreports\/(\d+)\//);
    if (reportIdMatch) {
      const reportId = parseInt(reportIdMatch[1], 10);
      const existingReport = reports.find((report) => report.id === reportId);
      if (!existingReport) {
        throw new Error(`Report with ID ${reportId} not found`);
      }

      // Deep clone the existing report to avoid mutation
      const updatedReport: Report = JSON.parse(JSON.stringify(existingReport));

      // If patch data contains updated report catalogues, merge it with the existing report data
      if (data?.report_catalogues_data) {
        data.report_catalogues_data.forEach((cataloguePatch) => {
          const catalogueToUpdate = updatedReport.report_catalogues.find(
            (cat) => cat.id === cataloguePatch.id
          );
          if (catalogueToUpdate) {
            cataloguePatch.resultats.forEach((resultatPatch) => {
              const resultatToUpdate = catalogueToUpdate.resultats.find(
                (res) => res.id === resultatPatch.id
              );
              if (resultatToUpdate) {
                resultatPatch.resultat_details.forEach((detailPatch) => {
                  const detailToUpdate = resultatToUpdate.resultat_details.find(
                    (det) => det.id === detailPatch.id
                  );
                  if (detailToUpdate) {
                    // Update the details with new values
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

      // Simulate the updated response as if the report was successfully updated
      return {
        data: updatedReport as T, // Cast to the expected response type
      };
    }

    throw new Error(`Unknown PATCH API route: ${url}`);
  },
};

export default axios;
