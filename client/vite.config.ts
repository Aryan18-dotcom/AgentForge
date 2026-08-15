import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the active building mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  // Fallback defaults if variables are missing
  const baseApiUrl = env.VITE_BASE_URL || "http://localhost:5001/api"; 
  const widgetCssUrl = env.WIDGET_VITE_CSS_URL || "http://localhost:5173/AgentConfigs/widget-core.css";

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'compile-widget-environment',
        // Change closeBundle to an async function to support a delay retry loop
        async closeBundle() {
          // Absolute path targeting your output production distribution folder
          const widgetPath = path.resolve(__dirname, 'dist/AgentConfigs/widget.js');

          // Helper function to introduce a small pause
          const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

          let fileFound = false;
          // Retry up to 5 times (total 500ms max) to verify the file has been fully copied by Vite
          for (let attempt = 1; attempt <= 5; attempt++) {
            if (fs.existsSync(widgetPath)) {
              fileFound = true;
              break;
            }
            await delay(100); 
          }

          if (fileFound) {
            let fileContent = fs.readFileSync(widgetPath, 'utf8');

            // DIAGNOSTIC LOGS: Prints directly to your terminal when you run 'npm run build'
            console.log('\n\x1b[36m%s\x1b[0m', '⚙ [AgentForge Compiler Debug Matrix]:');
            console.log(`  -> Injecting API URL: ${baseApiUrl}`);
            console.log(`  -> Injecting CSS URL: ${widgetCssUrl}\n`);

            // Swap out the text template tokens with actual production values globally
            fileContent = fileContent
              .replace(/__VITE_BASE_URL__/g, baseApiUrl)
              .replace(/__WIDGET_VITE_CSS_URL__/g, widgetCssUrl);

            fs.writeFileSync(widgetPath, fileContent, 'utf8');
            console.log('\x1b[32m%s\x1b[0m', '✓ [AgentForge Build Plugin]: Successfully injected environment variables into widget.js pipeline.');
          } else {
            console.log('\n\x1b[31m%s\x1b[0m', '✗ [AgentForge Build Error]: File copy operation timed out.');
            console.log(`  -> Expected location: ${widgetPath}`);
            console.log('  -> Tip: Verify that your widget.js is inside "client/public/AgentConfigs/widget.js"\n');
          }
        }
      }
    ],
  };
})