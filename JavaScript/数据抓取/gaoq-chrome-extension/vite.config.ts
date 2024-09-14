import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import copy from 'rollup-plugin-copy'
import crx from 'vite-plugin-crx-mv3'

// import Components from 'unplugin-vue-components/vite';
// import { VantResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'
export default defineConfig(({ mode }) => {
  console.log('current mode', mode)
  return {
    plugins: [
      vue(),
      // Components({
      //   resolvers: [VantResolver()],
      // }),
      crx({
        manifest: './src/manifest.json'
      }),

      // copy({
      //   verbose: true,
      //   targets: [
      //     { src: 'src/assets/ionicons.*', dest: 'dist/assets' }, //执行拷贝
      //   ]
      // })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, '../common'),
      },
      extensions: ['.js', '.mjs', '.vue', '.json', '.less', '.css']
    },
    base: './',
    build: {
      emptyOutDir: mode == 'production',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    },
    server: {
      https: true
    }
  }
})
