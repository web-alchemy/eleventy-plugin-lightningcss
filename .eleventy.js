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

  eleventyConfig.addFilter('transformStyles', async(content, options) => {
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
      }
    },

    async compile(inputContent, inputPath) {
      if (!userOptions.filter(inputContent, inputPath)) {
        return
      }

      return async function(data) {
        const bundleResult = await bundleStyles({
          filename: inputPath,
          code: Buffer.from(inputContent)
        })

        const content = bundleResult.code.toString()

        return content
      }
    }
  })
}