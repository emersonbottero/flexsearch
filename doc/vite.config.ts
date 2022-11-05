import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";

var options = {};

export default defineConfig({
  plugins: [SearchPlugin(options)],
});
