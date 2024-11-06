// utils/translationHelper.ts

// Define a type for the translations object to ensure proper key-value pairing
type Translations = {
    [key: string]: string;
  };
  
  // Use generics to allow `getTranslation` to infer the exact keys of the translation object if needed
  const t = <T extends Translations>(translations: T, key: keyof T): string => {
    return translations[key] || `Translation missing for ${String(key)}`;
  };
  
  export default t;