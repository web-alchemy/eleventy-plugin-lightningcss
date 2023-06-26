# Eleventy Plugin for [LightningCSS](https://lightningcss.dev/)

Plugin adds template format for CSS and filter `transformStyles` processing by LightningCSS.

## Installation

```sh
npm install @web-alchemy/eleventy-plugin-lightningcss
```

## Configuration

```javascript
const EleventyPluginLightningCSS = require('@web-alchemy/eleventy-plugin-lightningcss');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginLightningCSS, {
    // filter files that should not be processed
    filter(inputContent, inputPath) {
      return !inputPath.includes('components');
    },

    // options passed to lightningcss functions `transform` and `bundle`
    lightningcss: {
      minify: process.env.NODE_ENV === 'production'
    },
    
    // browserlist query (https://browsersl.ist/)
    targets: '>= 0.1%'
  })
}
```

## Usage

See [example in repository](https://github.com/web-alchemy/eleventy-plugin-lightningcss/tree/main/example)