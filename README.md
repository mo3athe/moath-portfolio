# Moath Alnajem — Portfolio

Personal portfolio of **Moath Alnajem (معاذ الناجم)**, IT Support Specialist in Dhahran, Saudi Arabia.
Bilingual (English / Arabic with full RTL), with a Three.js network scene, scroll-driven camera,
an Intern Connect screen gallery, career journey, skills, certifications, and a downloadable CV.

It is a **static site**: no build step and no dependencies to install. React, Three.js, Motion and
Lucide icons load from public CDNs.

## Project structure

```
index.html                  Page shell, SEO metadata, library scripts
assets/css/styles.css       All styles
assets/js/app.js            All content (English + Arabic) and components
assets/img/                 Portrait and Intern Connect screenshots
assets/docs/                CV (PDF)
vercel.json                 Caching and security headers for Vercel
```

## Run it on your computer

Any static server works. From this folder:

```
npx serve .
```

or

```
python -m http.server 8000
```

Then open the address it prints (for example http://localhost:8000). Opening `index.html`
directly by double-clicking also works, but a local server is closer to the live site.

## Deploy on Vercel (free)

1. Push this folder to a GitHub repository (for example `moath-portfolio`).
2. Go to https://vercel.com, sign in with GitHub, and choose **Add New… → Project**.
3. Import the `moath-portfolio` repository.
4. Leave the settings as they are: Framework Preset **Other**, no build command,
   output directory is the project root.
5. Click **Deploy**. Your site will be live at `https://<project-name>.vercel.app`.

Every later push to the `main` branch redeploys the site automatically.

## Editing content

After changing `styles.css` or `app.js`, raise the `?v=` number on their links in `index.html` (for example `?v=3`) so browsers load the new version.


- **Text** (both languages): the `T` object near the top of `assets/js/app.js`
  (`T.en` and `T.ar`). Keep the same keys in both languages.
- **Links, CV, portrait, screenshots**: the `REAL ASSETS & LINKS` block at the top of `app.js`.
- **Store screenshots**: put the images in `assets/img/` and set
  `STORE_SHOTS.tag` / `STORE_SHOTS.qeraaty` to their paths (e.g. `"assets/img/tagplus.webp"`).
- **Colors and fonts**: the `:root` variables at the top of `assets/css/styles.css`.
