// WebXR対応したい場合はよしなに設定する

// import fs from "fs"
import { defineConfig } from "vite"
import topLevelAwait from "vite-plugin-top-level-await"

export default defineConfig({
  /*server: {
    https: {
      key: fs.readFileSync("./cert/localhost-key.pem"),
      cert: fs.readFileSync("./cert/localhost.pem")
    }
  },*/
  plugins: [
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: i => `__tla_${i}`
    })
  ]
})
