/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'phero-web.nyc3.cdn.digitaloceanspaces.com',
  //       port: '',
  //       pathname: '/uat-images/public/**',
  //     },
  //   ],
  // },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  reactStrictMode: false,
  swcMinify: false,
  productionBrowserSourceMaps: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Important: return the modified config
    config.module.rules.push({
      test: /\.mjs$/,
      enforce: 'pre',
      use: ['source-map-loader'],
    });
    return config;
  },
  images: {
    domains: ['phero-web.nyc3.cdn.digitaloceanspaces.com'],
  },
};

module.exports = nextConfig;
