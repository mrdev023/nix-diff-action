import { defineConfig } from "vite";
import { resolve } from "node:path";

// @actions/artifact refuses to run on non-github.com/ghe.com hosts, but
// Forgejo's runner implements the same ACTIONS_RESULTS_URL artifact service API.
// This plugin patches isGhes() to return false so the artifact client works.
const forgejoArtifactCompatPlugin = {
  name: "forgejo-artifact-compat",
  transform(code: string, id: string) {
    if (id.includes("@actions/artifact") && code.includes("isGhes")) {
      return code.replace(
        /return !isGitHubHost && !isGheHost && !isLocalHost;/,
        "return false;",
      );
    }
  },
};

export default defineConfig({
  plugins: [forgejoArtifactCompatPlugin],
  build: {
    target: "ES2022",
    sourcemap: true,
    ssr: true,
    outDir: "dist",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        cleanup: resolve(import.meta.dirname, "src/cleanup.ts"),
      },
      output: {
        format: "es",
        entryFileNames: "[name].js",
      },
    },
  },
  ssr: {
    target: "node",
    // Bundle all dependencies into single file (required for GitHub Actions)
    noExternal: true,
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/.direnv/**"],
  },
});
