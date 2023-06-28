module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    TOKEN_CONTRACT_ADDRESS: process.env.TOKEN_CONTRACT_ADDRESS,
    REGISTRY_CONTRACT_ADDRESS: process.env.REGISTRY_CONTRACT_ADDRESS,
    POOLMARKET_CONTRACT_ADDRESS: process.env.POOLMARKET_CONTRACT_ADDRESS,
    PAYMENT_CONTRACT_ADDRESS: process.env.PAYMENT_CONTRACT_ADDRESS,
    BACKEND_URL: process.env.BACKEND_URL,
    RPC_URL: process.env.RPC_URL,
  },
  async rewrites() {
    const DEFAULT_BACKEND_BASE_URL = "http://localhost:3005";
    const URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? DEFAULT_BACKEND_BASE_URL;
    return [
      {
        source: "/api/:path*",
        destination: `${URL}/:path*`,
      },
      {
        source: "/api/:path*/:param1",
        destination: `${URL}/:path*/:param1`,
      },
      {
        source: "/api/:path*/:param1/:param2",
        destination: `${URL}/:path*/:param1/:param2`,
      },
    ];
  },
}
