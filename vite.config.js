import { defineConfig } from 'vite'
import { resolve } from 'path';
//vite config
/** @type {import('vite').UserConfig} */
export default defineConfig({
  // config for vite
  alias: {
    '@src': resolve(__dirname, 'src'),
    '@components': resolve(__dirname, 'lib/components'),
    '@core': resolve(__dirname, 'lib/core'),
  },

})