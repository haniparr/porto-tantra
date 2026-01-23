/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com", // Untuk Parallax Intro
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Untuk Blog & Portfolio
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // <-- PENTING: Solusi error Anda saat ini
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Untuk Client Logos di Services Page
      },
      {
        protocol: "http",
        hostname: "localhost", // Untuk fetch gambar dari Strapi Local (port 1337)
        port: "1337",
      },
    ],
  },
};

export default nextConfig;
