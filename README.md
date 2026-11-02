# Rona Stories Studio

A Hebrew, right-to-left Instagram Stories editor. Includes four templates, draggable text layers, font/color/alignment controls, photo backgrounds, undo, browser-local draft persistence, and full-size 1080 × 1920 PNG export. Responsive layout supports desktop and mobile.

## Run

Requires Node.js 22 or newer. No dependencies or API keys are needed.

```sh
npm start
```

The server listens on port 3000 (`PORT` overrides it). Open the app in your browser. Pick a template, edit or add text, drag text on the canvas, upload a background photo, and download the PNG. Selecting a template replaces the current design; undo restores it. Drafts stay in the current browser and are not uploaded. Images are resized locally before saving; browser storage limits may prevent saving large drafts.

## Validate

```sh
npm test
npm run check
```

No build step is required. Deploy the static `index.html` and `src/` directory to a static host, or run the included Node development server. The server is intended for local development.

## Deploy to GitHub Pages and use on Android

1. On GitHub, open **Settings → Pages** for `RonaMi22/rona-stories-studio`.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch **main**, folder **/ (root)**, and click **Save**.
4. Wait for the Pages deployment to finish. GitHub displays the published site link on that settings page. The expected address is `https://ronami22.github.io/rona-stories-studio/`.
5. Open that link in Chrome on Android. Use the download button to save a story PNG, then choose that image in Instagram's Story composer.

Chrome's menu → **Add to Home screen** creates a convenient shortcut. An internet connection is required to load the editor; this app does not provide offline installation. Drafts are stored only in the browser where they were created. Clearing site data removes them. The app does not post directly to Instagram.

GitHub Pages serves these static files directly, without Node or an install step. Relative asset paths support the repository's Pages subdirectory. `.nojekyll` prevents unnecessary Jekyll processing. Pages availability depends on the repository's visibility and GitHub plan.
