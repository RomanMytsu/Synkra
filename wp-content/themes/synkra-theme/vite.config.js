import { defineConfig } from "vite";

import { fileURLToPath, URL } from "node:url";
import path from "node:path";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const assetsDir = path.resolve(__dirname, "src/assets");
const assetsImgDir = path.resolve(__dirname, "src/assets/img");
const outDir = path.resolve(__dirname, "dist");

function copyDirectory(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    return;
  }

  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, entry);
    const targetPath = path.join(targetDir, entry);

    if (statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

function copyAssetsImages() {
  return {
    name: "copy-assets-images",
    apply: "build",

    writeBundle() {
      const targetDir = path.join(outDir, "assets/img");

      copyDirectory(assetsImgDir, targetDir);

      console.log("✓ src/assets/img → dist/assets/img");
    },
  };
}

export default defineConfig({
  base: "./",

  input: fileURLToPath(new URL("./src/js/main.js", import.meta.url)),

  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@": path.resolve(__dirname, "src"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },

  plugins: [copyAssetsImages()],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rolldownOptions: {
      output: {
        entryFileNames: "js/main.js",

        assetFileNames: (assetInfo) => {
          const names = assetInfo.names ?? [];

          if (names.some((name) => name.endsWith(".css"))) {
            return "css/style.css";
          }

          const originalFileName = assetInfo.originalFileNames?.[0];

          if (originalFileName) {
            const relativePath = path
              .relative(assetsDir, originalFileName)
              .replace(/\\/g, "/");

            if (relativePath && !relativePath.startsWith("../")) {
              return `assets/${relativePath}`;
            }
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
