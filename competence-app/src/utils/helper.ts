// src/utils/helper.ts
import axios from 'axios';
import logo from  "@/assets/logo.png"; 
  

//console.log("original Helper loaded env=",process.env.NEXT_PUBLIC_ENV );

//const isDemo = process.env.NEXT_PUBLIC_ENV === 'demo';


/**
 * Returns the Base64 data from localStorage or a default fallback image.
 * @param imageKey The key used to fetch the image.
 * @returns Base64 data if available, or a fallback image path.
 */
export const getImageData = (imageKey: string): string => {
  //if (isDemo) { 
  //  const base64Image = await getImageDataDemo(imageKey); // Call the demo function if in demo mode
  //  return base64Image
  //}

    const base64Data = localStorage.getItem(imageKey);
  
     return base64Data  || logo.src; 
   
  };

  
export async function fetchBase64Image(itemKey: string, idImage: number, token: string): Promise<void> {


  try {
    console.log(`fetchBase64Image original helper (no moking!!!!)  `);
    const storedImage = localStorage.getItem(itemKey);
    const storedTimestamp = localStorage.getItem(`${itemKey}_timestamp`);
    const cacheExpiryTime = 60 * 60 * 1000; // 1 hour in milliseconds
    const isExpired = storedTimestamp ? (Date.now() - parseInt(storedTimestamp) > cacheExpiryTime) : true;


    //console.log("look if there is a stored image for key",itemKey);

    if (!storedImage || isExpired) {
      console.log(`Fetching image for key ${itemKey} from ${idImage}...`);
      
      // Fetch the image data from your Django API
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/myimage/${idImage}/base64/`, {
        headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
      });
      const base64Image = response.data.image_base64;

      // Store the fetched base64 image in localStorage
      if (base64Image && !base64Image.includes("default")) {
        localStorage.setItem(itemKey, base64Image);
        localStorage.setItem(`${itemKey}_timestamp`, Date.now().toString());
        console.log(`Image successfully stored in localStorage with key ${itemKey}`);
      } else {
        console.log(`No valid image found for key ${itemKey}. Skipping storage.`);
      }
    } //else {
      console.log(`Image already exists in localStorage for key ${itemKey}.`);
    //}
  } catch (error) {
    console.error(`Error fetching image for key ${itemKey}:`, error);
  }
} 

export const formatDate = (dateString: string | null | undefined): string => {
  // Return an empty string if the dateString is null, undefined, or invalid
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "";
  }

  // Parse the date string into a Date object
  const date = new Date(dateString);
  
  // Extract components of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Return formatted string: YYYY-MM-DD HH:MM
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
