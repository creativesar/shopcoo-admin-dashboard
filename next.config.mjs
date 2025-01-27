/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cdn.sanity.io'],
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://zkhlo23.apicdn.sanity.io/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;
  