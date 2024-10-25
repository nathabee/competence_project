import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NEXT_PUBLIC_ENV || 'production';

console.log(`Loaded environment: ${env}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`NEXT_PUBLIC_ENV: ${process.env.NEXT_PUBLIC_ENV}`);
console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
console.log(`NEXT_PUBLIC_BASE_PATH: ${process.env.NEXT_PUBLIC_BASE_PATH}`);
console.log(`NEXT_PUBLIC_ADMIN_URL: ${process.env.NEXT_PUBLIC_ADMIN_URL}`);
console.log(`NEXT_PUBLIC_MEDIA_URL: ${process.env.NEXT_PUBLIC_MEDIA_URL}`);

/**
 * Next.js config
 */
export const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  }, 
  webpack: (config) => {
    if (env === 'demo') { 
      config.resolve.alias = {
        ...config.resolve.alias,
        axios: path.resolve(__dirname, 'src/demo/utils/demoAxios.ts'),
        jwt: path.resolve(__dirname, 'src/demo/utils/demoJwt.ts'),
      };
    }

    config.resolve.fallback = {
      fs: false,
      child_process: false,
      crypto: false,
    };

    return config;
  },

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`,
  trailingSlash: env === 'demo',
 
};

console.log(`basePath: ${nextConfig.basePath}`);
console.log(`assetPrefix: ${nextConfig.assetPrefix}`);

// Conditionally add the output property only for the demo environment
if (env === 'demo') {
  nextConfig.output = 'export'; // Enable static export
}

export default nextConfig;
