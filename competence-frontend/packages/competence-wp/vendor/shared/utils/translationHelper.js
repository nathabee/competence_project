// utils/translationHelper.ts
import { useAuth } from '@shared/context/AuthContext'; // Use AuthContext to manage state
// Helper function to replace placeholders within a translation string
const replacePlaceholders = (template, replacements) => {
    return template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] || `{${key}}`);
};
const useTranslation = () => {
    const { translations } = useAuth();
    // Main t function with optional replacements
    const t = (key, replacements = {}) => {
        const template = translations[key];
        if (!template) {
            return `${key}`;
        }
        return replacePlaceholders(template, replacements);
    };
    return t;
};
export default useTranslation;
