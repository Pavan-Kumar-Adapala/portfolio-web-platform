import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/', // or '/Personal_portfolio_3d_animation/' if using GitHub Pages without a custom domain
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Allow access from any host
    port: 5173, // Specify the port you want to use
    strictPort: true, // Ensure the server uses the specified port
    // hmr means Hot Module Replacement
    // This allows the server to update modules in the browser without a full reload
    // The protocol, host, and port can be customized for HMR
    // If you want to use a different protocol or port for HMR, you can specify
    // them here. By default, it uses WebSocket on the same host and port as
    // the server.
  },
  build: {
    outDir: 'dist', // Specify the output directory for the build
  },
});
