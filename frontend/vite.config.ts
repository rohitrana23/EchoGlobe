import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

// vite-plugin-cesium automatically copies CesiumJS workers, assets,
// and widgets into the build output and sets CESIUM_BASE_URL.
export default defineConfig({
  plugins: [react(), cesium()],
})
