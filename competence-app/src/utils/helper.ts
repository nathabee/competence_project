// src/utils/helper.ts

// Define the type of each cached image as an object containing base64 and timestamp
interface CachedImage {
  base64: string;
  timestamp: number;
}

// Cache object to store images
const imageCache: { [key: string]: CachedImage } = {}; // Cache outside of function

// Function to fetch and convert an image to base64
async function getBase64Image(fileName: string): Promise<string> {
  console.log(`Attempting to fetch image from ${fileName}...`);
  const response = await fetch(`${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  console.log(`Image fetched for ${fileName}, converting to Base64...`);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(`Image conversion to Base64 complete for ${fileName}.`);
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      console.error(`Error converting ${fileName} to Base64.`);
      reject('Failed to convert image to base64');
    };
    reader.readAsDataURL(blob);
  });
}

// Function to return cached or freshly fetched base64 image
export async function getOrFetchBase64Image(fileName: string): Promise<string> {
  try {
    console.log(`Checking cache for ${fileName}...`);
    const cacheExpiryTime = 60 * 60 * 1000; // 1 hour in milliseconds
    const cachedImage = imageCache[fileName];

    // Check if the image is in cache and if it's still valid
    if (cachedImage && Date.now() - cachedImage.timestamp < cacheExpiryTime) {
      console.log(`Cache hit for ${fileName}. Using cached image.`);
      return cachedImage.base64; // Return cached base64 image
    }

    console.log(`Cache miss for ${fileName} or cache expired. Fetching new image...`);
    const base64Image = await getBase64Image(fileName);

    // Store the newly fetched image in the cache
    imageCache[fileName] = {
      base64: base64Image,
      timestamp: Date.now(),
    };

    console.log(`Image ${fileName} fetched and cached successfully.`);
    return base64Image;
  } catch (error) {
    console.error(`Failed to fetch Base64 image for ${fileName}:`, error);
    console.log(`Falling back to default image.`);
    return ""; // Indicate no valid image was found
  }
}

// New function to fetch and store the base64 image in localStorage without returning it
export async function fetchBase64Image(itemKey: string, imageUrl: string): Promise<void> {
  try {
    // Check if the image has already been stored in localStorage
    const storedImage = localStorage.getItem(itemKey);
    
    // Check the timestamp for the stored image
    const storedTimestamp = localStorage.getItem(`${itemKey}_timestamp`);
    const cacheExpiryTime = 60 * 60 * 1000; // 1 hour in milliseconds
    const isExpired = storedTimestamp ? (Date.now() - parseInt(storedTimestamp) > cacheExpiryTime) : true;

    if (!storedImage || isExpired) {
      console.log(`Image not found in localStorage or expired for key ${itemKey}. Fetching from ${imageUrl}...`);
      
      // Fetch the image if it's not stored yet or expired
      const base64Image = await getOrFetchBase64Image(imageUrl);
      
      // Only store the image if it's valid (not default or empty)
      if (base64Image && !base64Image.includes("default")) {
        localStorage.setItem(itemKey, base64Image);
        localStorage.setItem(`${itemKey}_timestamp`, Date.now().toString());
        console.log(`Image successfully stored in localStorage with key ${itemKey}`);
      } else {
        console.log(`No valid image found for key ${itemKey}. Skipping storage.`);
      }
    } else {
      console.log(`Image already exists in localStorage for key ${itemKey}.`);
    }
  } catch (error) {
    console.error(`Error fetching image for key ${itemKey}:`, error);
  }
}
