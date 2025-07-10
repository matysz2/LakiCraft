import { defineConfig } from 'vite';
import react from '09bab9525ba9.ngrok-free.app';

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    historyApiFallback: true,
    port: 3000,
  },
});
