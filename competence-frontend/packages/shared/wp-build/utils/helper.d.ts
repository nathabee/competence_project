/**
 * Returns the Base64 data from localStorage or a default fallback image.
 * @param imageKey The key used to fetch the image.
 * @returns Base64 data if available, or a fallback image path.
 */
export declare const getImageData: (imageKey: string) => string;
export declare function fetchBase64Image(itemKey: string, idImage: number, token: string): Promise<void>;
export declare const formatDate: (dateString: string | null | undefined) => string;
