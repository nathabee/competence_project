'use client';

// Import necessary data for the mock
import catalogues from '@/demo/data/json/catalogues.json';
import eleves from '@/demo/data/json/eleves.json';
import niveaux from '@/demo/data/json/niveaux.json';
import pdflayouts from '@/demo/data/json/pdflayouts.json';
import shortreports from '@/demo/data/json/shortreports.json';
import reportsRaw from '@/demo/data/json/fullreports.json';
import scorerulepoints from '@/demo/data/json/scorerulepoints.json';
import tokenData from '@/demo/data/json/token.json'; 
import users from '@/demo/data/json/users.json';

import translationsFr from '@/demo/data/translation/translations_fr.json';
import translationsEn from '@/demo/data/translation/translations_en.json';
import translationsDe from '@/demo/data/translation/translations_de.json';
import translationsBr from '@/demo/data/translation/translations_br.json';

import { Report } from '../../types/report';
import { ReportPatch } from '../../types/reportpatch'; 


// Type guard to ensure that data is a valid Report
function isReport(data: unknown): data is Report {
  return (
    typeof data === 'object' &&
    data !== null &&
    'eleve' in data &&
    'professeur' in data &&
    'pdflayout' in data &&
    'id' in data &&
    'created_at' in data &&
    'updated_at' in data &&
    'report_catalogues' in data
  );
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
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

export const axios = {


      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get: async <T>(url: string, _config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
 

    console.log('AXIOS Mocking GET url:', url); //ok
 

    if (url === `${apiUrl}/catalogues/`) return { data: catalogues as T };
    if (url === `${apiUrl}/eleves/`) return { data: eleves as T };
    if (url === `${apiUrl}/niveaux/`) return { data: niveaux as T };
    if (url === `${apiUrl}/pdf_layouts/`) return { data: pdflayouts as T };
    if (url === `${apiUrl}/shortreports/`) return { data: shortreports as T };
    if (url === `${apiUrl}/scorerulepoints/`) return { data: scorerulepoints as T };
    //if (url === `${apiUrl}/token/`) return {   save in localstorage the username  ; data: tokenData as T };

    if (url === `${apiUrl}/users/me/`) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}'); // Get the stored user info
      if (userInfo && userInfo.username) {
        // Find the complete user data from `users.json`
        const user = users.find(u => u.username === userInfo.username);
        if (user) {
          return { data: user as T };
        } else {
          throw new Error('User not found');
        }
      } else {
        throw new Error('User not logged in');
      }
    }

    const reportsPattern = new RegExp(`^${apiUrl}/eleve/(\\d+)/reports/$`);
    const match = url.match(reportsPattern);

    if (match) {
      const eleveId = match[1];
      const filteredReports = reports.filter(report => report.eleve === parseInt(eleveId));
      return { data: filteredReports as T };
    }

    // check if translation patern
        // Handle the translations endpoint
        const translationsPattern = new RegExp(`^${apiUrl}/translations\\?lang=(\\w+)$`);
        const translationsMatch = url.match(translationsPattern);
    
        if (translationsMatch) {
          const lang = translationsMatch[1]; // Extract language code
          let translationData;
    
          switch (lang) {
            case 'fr':
              translationData = translationsFr;
              break;
            case 'en':
              translationData = translationsEn;
              break;
            case 'de':
              translationData = translationsDe;
              break;
            case 'br':
                translationData = translationsBr;
                break;
            default:
              translationData = translationsEn;
              throw new Error(`Unsupported language code: ${lang}`);
          }
    
          return { data: translationData as T };
        }



    // Check if the URL ends with "/base64/" to apply image Base64 transformation 
    const base64Pattern = /\/base64\/$/;
    if (base64Pattern.test(url)) {
      const imagePathMap: Record<string, string> = {
        [`${apiUrl}/myimage/1/base64/`]: `${mediaUrl}png/beebot.png`,
        [`${apiUrl}/myimage/2/base64/`]: `${mediaUrl}png/categorisation.png`,
        [`${apiUrl}/myimage/3/base64/`]: `${mediaUrl}png/couleur.png`,
        [`${apiUrl}/myimage/4/base64/`]: `${mediaUrl}png/histoire.png`,
        [`${apiUrl}/myimage/5/base64/`]: `${mediaUrl}png/nombre.png`,
        [`${apiUrl}/myimage/6/base64/`]: `${mediaUrl}png/phonologie.png`,
        [`${apiUrl}/myimage/7/base64/`]: `${mediaUrl}png/prenom.png`,
        [`${apiUrl}/myimage/8/base64/`]: `${mediaUrl}png/probleme.png`,
        [`${apiUrl}/myimage/9/base64/`]: `${mediaUrl}png/spacial.png`,
        [`${apiUrl}/myimage/10/base64/`]: `${mediaUrl}png/probleme.png`,
        [`${apiUrl}/myimage/11/base64/`]: `${mediaUrl}png/spacial.png`,
      };

      const imagePath = imagePathMap[url];
      if (imagePath) {
        try {
          //console.log('AXIOS Mocking GET going to call convertImageToBase64 for path:', imagePath); 
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

        if (url.startsWith(`${apiUrl}/users/`)) {
        const urlParams = new URLSearchParams(url.split('?')[1]); // Extract query params from URL
        const role = urlParams.get('role'); // Get the role query parameter

        if (role) {
            // Filter users based on the role
            const filteredUsers = users.filter(user => user.roles.includes(role));

            return { data: filteredUsers as T };
        }
    }

    // If no route matches
    throw new Error(`Unknown API route: ${url}`);
  },

  post: async <T, R = Report>(url: string, data?: R, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    if (config) {
        console.log('POST config:', config);
    }

    // Handle POST request for token (expects username and password)
    if (url === `${apiUrl}/token/`) {
        // Check if data contains username and password
        if (!data || typeof data !== 'object' || !('username' in data) || !('password' in data)) {
            throw new Error('Invalid request data for token');
        }

        // Extract username and password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { username, password } = data as { username: string; password: string };

        console.log("Handle POST request for token username", username);
        
        // Find the user in the list
        const user = users.find(u => u.username === username);

        // If user exists, return token data
        if (user) {
            localStorage.setItem('userInfo', JSON.stringify(user));
            return { data: tokenData as T };
        } else {
            throw new Error('Invalid username or password');
        }
    }

    // Handle POST request for creating a full report (expects Report type)
    if (url === `${apiUrl}/fullreports/`) {
        if (!data) {
            throw new Error('No data provided for fullreports');
        }

        // Handle the case when data is of type Report
        if (isReport(data)) {
            // Create a new Report object
            const newReport: Report = {
                id: 7, // Mock ID for the new report
                eleve: data.eleve,  // Copying over the student info
                professeur: data.professeur,  // Copying over the professor info
                pdflayout: 1, // Add a placeholder for pdflayout
                report_catalogues: data.report_catalogues || [],  // Copying over report catalogues
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            return { data: newReport as T }; // Returning the new Report as the response
        } else {
            throw new Error('Invalid Report data format for /fullreports/ endpoint');
        }
    }

      // If the route is unknown, throw an error
      throw new Error(`Unknown API route: ${url}`);
  },


  patch: async <T>(url: string, data?: ReportPatch, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    //console.log('PATCH request URL:', url, 'Data:', data);
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



