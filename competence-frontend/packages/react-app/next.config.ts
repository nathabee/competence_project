import type { Configuration } from 'webpack';

const nextConfig = {
  webpack: (config: Configuration & { resolve?: any }, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
        },
      };
    }

    return config;
  },
};

export default nextConfig;
