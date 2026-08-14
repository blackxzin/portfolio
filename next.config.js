const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // há outro lockfile acima deste diretório; fixa a raiz para o Turbopack não adivinhar
  turbopack: { root: __dirname },
  poweredByHeader: false,
};

module.exports = nextConfig;
