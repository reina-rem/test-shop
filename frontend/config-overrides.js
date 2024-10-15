// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { addBabelPlugins, override } = require("customize-cra")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

module.exports = override(
  ...addBabelPlugins("@emotion"),
  (config) => {
    const outputJsFilename = "main.js"
    const outputCssFilename = "main.css"

    config.output.filename = outputJsFilename
   
    config.plugins.forEach((plugin) => {
      if (plugin instanceof MiniCssExtractPlugin) {
        plugin.options.filename = outputCssFilename
      }
    })

    config.output.path = path.resolve(__dirname, "build")

    config.plugins.forEach((plugin) => {
      if (plugin instanceof MiniCssExtractPlugin) {
        plugin.options.filename = path.join("static/css", outputCssFilename)
      }
    })
    
    config.output.filename = path.join("static/js", outputJsFilename)

    return config
  }
)
