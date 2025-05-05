import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // <- Важно добавить!

export default defineConfig({
    plugins: [vue()],
    base: './',
})