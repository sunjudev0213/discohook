/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/order */

const cp = require("child_process")

const config = {
  target: "serverless",
  poweredByHeader: false,
  distDir: "build",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  generateBuildId: async () => {
    if (process.env.BUILD_ID) return process.env.BUILD_ID

    return new Promise((resolve, reject) => {
      cp.execFile("git", ["rev-parse", "HEAD"], (error, stdout) => {
        if (error) reject(error)
        resolve(stdout)
      })
    })
  },
  redirects: async () =>
    Promise.resolve([
      {
        source: "/discord",
        destination: "https://discord.gg/dtPGCsm",
        permanent: false,
      },
      {
        source: "/bot",
        destination:
          "https://discord.com/api/oauth2/authorize?client_id=1157139021475098694&permissions=8&scope=bot%20applications.commands",
        permanent: false,
      },
    ]),
  headers: async () =>
    Promise.resolve([
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "upgrade-insecure-requests; frame-ancestors 'none';",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ]),
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer(config)
