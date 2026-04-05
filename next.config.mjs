/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
    formats: ["image/webp"], // Use WebP for better compression
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
        hostname: "placehold.co", // <-- PENTING: Solusi error Anda saat ini
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Untuk Client Logos di Services Page
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary images from database
      },
      {
        protocol: "http",
        hostname: "localhost", // Untuk fetch gambar dari Strapi Local (port 1337)
        port: "1337",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
