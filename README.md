# Rona Stories Studio

A Hebrew, right-to-left Instagram Stories editor. Includes nine finished story designs, editable text and vector artwork, font/color/alignment controls, photo backgrounds, undo, browser-local draft persistence, full-size 1080 × 1920 PNG export, and animated WebM export. Responsive layout supports desktop and mobile.

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

## The Rona collection

Nine finished 1080 × 1920 designs are included: three on Red Tent / menstrual traditions, three on severe period pain / endometriosis, and three on progesterone / the nervous system. Text, original faceless vector illustrations, ornaments, and source captions are independent layers. Select a layer to edit its text or illustration type, position, size, color, opacity, animation, and stacking order. Background and photo upload remain available. Template selection loads the original design; undo can recover the preceding draft.

Heebo and Assistant are bundled locally under `src/fonts/` with their SIL Open Font License notices. No font service, image service, API key, package installation, or build step is required. All artwork is original vector drawing in `src/art.js`.

Use **שמירת קובץ עריכה** to download a complete editable JSON design and **פתיחת קובץ עריכה** to restore it. Browser-local autosave retains the current draft, including older editor drafts. PNG export is static; animation preview and six-second WebM export use each layer's animation setting. WebM support depends on the browser, and Instagram may require conversion to MP4. The editor does not publish to Instagram.

### Editorial sources and boundaries

- Progesterone stories cite Schumacher et al. (2012), DOI [10.3389/fnins.2012.00010](https://doi.org/10.3389/fnins.2012.00010). The copy distinguishes progesterone from its metabolite allopregnanolone, identifies GABA-A modulation, and describes neuroprotection / myelin repair as research potential rather than an established treatment or a promise of calm. The review does not support the cultural or endometriosis stories. Source-page retrieval was blocked by this development environment's network policy; no claim of live full-text verification is made.
- Menstrual traditions vary by culture and context. Contemporary Red Tent gatherings are not presented as a single universal ancient tradition. Context: Anita Diamant, *The Red Tent* (1997), a novel rather than historical evidence; contemporary gatherings are distinct from historical menstrual seclusion practices.
- Endometriosis copy follows general patient guidance from [WHO](https://www.who.int/news-room/fact-sheets/detail/endometriosis) and [ESHRE's patient guideline](https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline): disabling pain warrants assessment, symptoms vary, normal ultrasound does not rule out disease. It offers no diagnosis or hormone regimen. Sudden severe pain or fainting prompts urgent assessment.
