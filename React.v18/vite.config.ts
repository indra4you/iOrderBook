import {
    resolve,
} from 'path';
import {
    defineConfig,
} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
    ],
    build: {
        outDir: resolve(
            __dirname,
            'publish'
        ),
        emptyOutDir: true,
    },
});