const lightningcss = require('lightningcss')
const browserslist = require('browserslist')

/**
 * @callback EleventyCustomTemplateFilter
 * @param {string} inputContent
 * @param {string} inputPath
 */

/**
 * @typedef {Object} PluginOptions
 * @property {EleventyCustomTemplateFilter} filter
 * @property {import('lightningcss').BundleAsyncOptions} lightningcss
 * @property {string} targets
 */

/**
 * @param {object} eleventyConfig
 * @param {PluginOptions} userOptions
 */
module.exports = function(eleventyConfig, userOptions = {}) {
  const targets = lightningcss.browserslistToTargets(browserslist(userOptions.targets))

  function bundleStyles(bundleOptions) {
    return lightningcss.bundleAsync({
      targets,
      ...userOptions.lightningcss,
      ...bundleOptions
    })
  }

  function transformStyles(transformOptions) {
    return lightningcss.transform({
      targets,
      ...userOptions.lightningcss,
      ...transformOptions,
    })
  }

  eleventyConfig.addFilter('transformStyles', function (content, options) {
    const buildResult = transformStyles({
      code: Buffer.from(content),
      ...options,
    })
    return buildResult.code.toString()
  })

  eleventyConfig.addTemplateFormats('css')

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',

    read: false,

    compileOptions: {
      permalink(inputContent, inputPath) {
        return (data) => {
          return data.permalink
        }
      },

      cache: true,

      getCacheKey: function(inputContent, inputPath) {
        return inputPath
      }
    },

    async compile(inputContent, inputPath) {
      if (!userOptions.filter(inputContent, inputPath)) {
        return
      }

      const bundleResult = await bundleStyles({
        filename: inputPath,
        sourceMap: true
      })

      const map = JSON.parse(bundleResult.map.toString())

      const dependencies = map.sources

      this.addDependencies(inputPath, dependencies)

      return async function(data) {
        const css = bundleResult.code.toString()
        return css
      }
    }
  })
}