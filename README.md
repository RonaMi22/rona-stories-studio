# Rona Stories Studio

A Hebrew, right-to-left Instagram Stories editor. Includes nine finished story designs, editable text, photographs, and color panels, font/color/alignment controls, photo backgrounds, undo, browser-local draft persistence, full-size 1080 × 1920 PNG export, and native H.264 MP4 export where supported and WebM fallback. Responsive layout supports desktop and mobile.

## Run

Requires Node.js 22 or newer. No dependencies or API keys are needed.

```sh
npm start
```

The server listens on port 3000 (`PORT` overrides it). Open the app in your browser. Pick a template, edit or add text, drag text on the canvas, upload or replace a photograph, and download the PNG. Selecting a story restores its own saved edits; reset loads its original layout, and undo restores the preceding design. Drafts stay in the current browser and are not uploaded. Images are resized locally before saving; browser storage limits may prevent saving large drafts.

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

## The editorial Rona collection

The redesign retains all nine Hebrew stories and their three research topics, using editable photographic frames and brand-color panels in place of the former illustrations. The original illustration renderer has been removed. Heebo and Assistant remain bundled locally under `src/fonts/` with their SIL Open Font License notices.

Each design includes a clearly labeled, editable photo placeholder, with all Hebrew copy and layout already complete. No stock photographs, silhouettes, cartoons, illustration assets, or external photo downloads are used. Placeholders can be exported immediately or replaced with the user's own JPG, PNG, or WebP photographs. Placeholder color, text, caption, and caption position are editable. The canvas upload button works on mobile; tapping an empty photo slot also opens the photo picker.

Every photograph has editable frame position, width/height, crop focus, zoom, opacity, color tint, and movement. Upload JPG, PNG, or WebP to replace a selected photograph. Text and brand-color panels remain independent layers, with stacking-order controls, drag positioning, undo, and animation settings. Each story's edits are saved separately in the browser. Older drafts are migrated without their illustrations; edited words and uploaded photographs are retained, and the original current draft is backed up locally.

Use **שמירת קובץ עריכה** to save editable JSON and **פתיחת קובץ עריכה** to restore it. PNG export is static. Video uses native browser MediaRecorder encoding: H.264 MP4 is preferred, with an explicitly labeled WebM fallback. Output is 1080 × 1920 at 30 fps with an editable 3–15-second duration. MP4 support depends on the browser; unsupported browsers offer WebM instead. Exporting a placeholder keeps its label in the output; replace it first to export your own photograph. Export freezes the design and editing controls until completion; a cancel action is available. No video or image is sent to an external service.

### Browser verification

`npm test` validates the model and draft migration; `npm run check` checks JavaScript syntax. For browser verification, install Playwright outside the repository and use an available Chromium binary and ffprobe:

```sh
npm install --prefix /tmp/rona-browser playwright --no-audit --no-fund
PLAYWRIGHT_MODULE=/tmp/rona-browser/node_modules/playwright node scripts/verify-editor.cjs
```

Start `npm start` first. `TEST_URL` can override the default local server address. The browser check renders all nine default placeholder designs directly. A synthetic image is used **only to simulate user uploads**, never as a bundled design asset. It tests photo replacement/cropping, per-story persistence, drag/undo, JSON round trips, PNG dimensions, actual H.264 MP4 metadata, mobile layout, tap-to-upload on mobile, text bounds, placeholder MP4 export, and recovery from corrupt uploaded images. It also asserts that no external image requests are made.

### Editorial sources and boundaries

- Progesterone stories cite Schumacher et al. (2012), DOI [10.3389/fnins.2012.00010](https://doi.org/10.3389/fnins.2012.00010). The copy distinguishes progesterone from its metabolite allopregnanolone, identifies GABA-A modulation, and describes neuroprotection / myelin repair as research potential rather than an established treatment or a promise of calm. The review does not support the cultural or endometriosis stories. Source-page retrieval was blocked by this development environment's network policy; no claim of live full-text verification is made.
- Menstrual traditions vary by culture and context. Contemporary Red Tent gatherings are not presented as a single universal ancient tradition. Context: Anita Diamant, *The Red Tent* (1997), a novel rather than historical evidence; contemporary gatherings are distinct from historical menstrual seclusion practices.
- Endometriosis copy follows general patient guidance from [WHO](https://www.who.int/news-room/fact-sheets/detail/endometriosis) and [ESHRE's patient guideline](https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline): disabling pain warrants assessment, symptoms vary, normal ultrasound does not rule out disease. It offers no diagnosis or hormone regimen. Sudden severe pain or fainting prompts urgent assessment.
