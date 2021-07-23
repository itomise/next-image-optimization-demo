/* eslint-disable
    @typescript-eslint/no-var-requires,
    @typescript-eslint/explicit-function-return-type
*/
const isProd = process.env.NODE_ENV === 'production'
const withPlugins = require('next-compose-plugins')
const withPWA = require('next-pwa')
const optimizedImages = require('next-optimized-images')

const nextConfig = {
  // distDir: isProd ? '.next-prod' : '.next',
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /(\.ttf|\.otf|\.woff|\.woff2)$/,
      use: 'raw-loader',
    })
    return config
  },
  pwa: {
    disable: !isProd,
    dest: 'public',
  },
}

const optimizedImagesConfig = {
  optimizeImagesInDev: true,
  removeOriginalExtension: true,
  responsive: {
    // disable: process.env.NODE_ENV === 'development',
    adapter: require('responsive-loader/sharp'),
    sizes: [640, 960, 1200, 1800],
  },
}

module.exports = withPlugins(
  [withPWA, [optimizedImages, optimizedImagesConfig]],
  nextConfig,
)
