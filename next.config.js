/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // or '50mb' or '1gb' depending on your needs
    },
  },
};

export default nextConfig;
