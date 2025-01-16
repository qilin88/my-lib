
import path from 'path'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ql/components': path.resolve(__dirname, './node_modules/@ql/components')
    }
  }
});