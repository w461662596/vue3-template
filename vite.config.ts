import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from "rollup-plugin-visualizer"
import Pages from "vite-plugin-pages"
import Layouts from "vite-plugin-vue-layouts"
import UnoCSS from 'unocss/vite'
import "./src/utils/origins.ts"

// https://vitejs.dev/config/
export default defineConfig(({command, mode})=>{
	const env = loadEnv(mode, process.cwd(), '')
	const timestamp = new Date().Format('yyyyMMddhhmmss')
	
	return {
		server:{
			host:'0.0.0.0',
			port: 8081,
			https:false,
			open:true,
			strictPort:false,
			hmr:true,
	//		proxy:{
	//			['^${env.VITE_BASE_API}']: {
	//      target: `env.VITE_PROXY_TARGET_URL`, //测试环境
	//      changeOrigin: true,
	//      rewrite: {
	//        ['^' + env.VITE_BASE_API]: ''
	//      }
	//    },
	//		}
		},
		build:{
			outDir: "./dist/",
		    brotliSize: false, // 关闭打包过程中计算包的大小
		    cssCodeSplit: true, //启用/禁用 CSS 代码拆分
		    assetsInlineLimit: 4096, // 图片转base64编码的阈值
		    sourcemap: false, //构建后是否生成 source map 文件
		    minify: 'terser',
		    
		    terserOptions:{
		    	drop_console: true,
		    	drop_debugger: true
		    },
		    target: ['chrome63'],
			rollupOptions:{
				output:{
					compact:true,
					chunkFileNames:`static/js/[name].[hash:9].${timestamp}.js`,
					entryFileNames:`static/js/[name].[hash:9].${timestamp}.js`,
					assetFileNames:`static/[ext]/[name].[hash:9].${timestamp}.[ext]`,
//					manualChunks:{
	//					vue:['vue','vue-router'],
	//					pinia:['pinia'],
	//					elementPlus:['element-plus']
//					}
				},
			}
		},
	  plugins: [
	    vue(),
	    vueJsx(),
	    visualizer({
	      open: true,
	      gzipSize: true
	    }),
	     AutoImport({
	      resolvers: [ElementPlusResolver()],
	      imports:[
	      	'vue',
	      	'@vueuse/core',
	      	'vue-router',
	      	'pinia'
	      ],
	      dirs:['src/stores', 'src/composables'],
	      dts:"src/types/auto-import.d.ts"
	    }),
	    Components({
	      resolvers: [ElementPlusResolver()],
	      dirs:['src/components'],
	      dts:"src/types/components.d.ts"
	    }),
	    Pages({
	    	dirs:['src/views'],
	    	excludes:['**/components/*.vue'],
	    	extendRoute(route, parent){
	    		if(route.path === '/'){
	    			return {
	    				...route,
	    				redirect:""
	    			}
	    		}
	    	}
	    }),
	    Layouts({
	    	layoutsDirs:['src/layouts'],
	    	defaultLayout:'default'
	    }),
	    UnoCSS({
	      configFile: './uno.config.ts',
	    })
	  ],
	  resolve: {
	    alias: {
	      '@': fileURLToPath(new URL('./src', import.meta.url))
	    },
	    extensions:['.ts', '.vue', '.json', '.js', '.jsx', '.tsx', '.scss', '.css', '.mjs','.cjs']
	  }
	}
})
