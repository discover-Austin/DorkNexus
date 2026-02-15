import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Use absolute path for web deployment (Vercel, etc), relative for Electron
    const isElectron = process.env.ELECTRON === 'true';
    const base = isElectron ? './' : '/';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        strictPort: true,
      },
      plugins: [react()],
      base, // Dynamic base path based on deployment target
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          output: {
            // Ensure consistent chunk naming for Electron
            entryFileNames: 'assets/[name].js',
            chunkFileNames: 'assets/[name].js',
            assetFileNames: 'assets/[name].[ext]'
          }
        },
        // Target modern browsers/Electron
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false,
      },
      optimizeDeps: {
        exclude: ['electron']
      }
    };
});
