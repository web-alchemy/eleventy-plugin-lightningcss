const EleventyPluginLightningCSS = require('../.eleventy.js')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginLightningCSS, {
    filter(inputContent, inputPath) {
      return !inputPath.includes('components')
    },

    lightningcss: {
      minify: process.env.NODE_ENV === 'production'
    }
  })

  return {
    dir: {
      input: 'src'
    }
  }
}