import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/student/dashboard',
        destination: '/student/dashboard/classrooms',
        permanent: false, // Set to true for a 301 (permanent) redirect
      },
    ];
  },};

export default nextConfig;


// const nextConfig = {

// };