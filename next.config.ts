import type { NextConfig } from 'next';
import withLlamaIndex from 'llamaindex/next';

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    };
    return config;
  },
};

export default withLlamaIndex(nextConfig);
