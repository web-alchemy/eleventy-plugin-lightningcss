const Eleventy = require('@11ty/eleventy')

;(async function() {
  const eleventy = new Eleventy()
  const result = await eleventy.toJSON()
  console.log(result)
})()