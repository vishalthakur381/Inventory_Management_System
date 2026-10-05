import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { transform } from 'sucrase';

const jsAsJsxPlugin = () => ({
  name: 'js-as-jsx',
  enforce: 'pre',
  transform(code, id) {
    const cleanId = id.split('?')[0];
    if (cleanId.endsWith('.js') && (cleanId.includes('/src/') || cleanId.includes('\\src\\'))) {
      const res = transform(code, {
        transforms: ['jsx'],
        jsxRuntime: 'automatic',
        production: true,
      });
      return {
        code: res.code,
        map: res.sourceMap,
      };
    }
  },
});

export default defineConfig({
  plugins: [
    jsAsJsxPlugin(),
    react(),
  ],
});
