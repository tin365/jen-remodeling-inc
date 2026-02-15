# Get the website to appear (GitHub Pages)

The **code** lives at: https://github.com/tin365/jen-remodeling-inc  
The **live website** will appear at: **https://tin365.github.io/jen-remodeling-inc/**

If the site doesn’t load, follow these steps.

---

## 1. Turn on GitHub Pages

1. Open the repo: https://github.com/tin365/jen-remodeling-inc  
2. Click **Settings** (top menu).  
3. In the left sidebar, click **Pages** (under “Code and automation”).  
4. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from a branch”).  
5. Save if there’s an option to.

---

## 2. Run the deploy workflow

The workflow runs when you push to `main`. So either:

- **Option A:** Push a small change from your computer (e.g. the `next.config.js` fix), then wait 1–2 minutes.  
- **Option B:** In the repo, go to **Actions** → open the **“Deploy to GitHub Pages”** workflow → click **Run workflow** → **Run workflow**. Wait until the run finishes (green check).

---

## 3. Open the correct URL

Use the **site** URL, not the repo URL:

- **Site (what you want):** https://tin365.github.io/jen-remodeling-inc/  
- **Repo (code only):** https://github.com/tin365/jen-remodeling-inc  

If the site is still blank:

- Wait 1–2 minutes after the workflow run.  
- Try a hard refresh (Cmd+Shift+R) or an incognito/private window.  
- In **Settings → Pages**, check that it says the site is published and shows the URL.

---

## 4. If it still doesn’t work

- In the repo, go to **Actions** and confirm the latest **“Deploy to GitHub Pages”** run succeeded (green). If it failed, open the run and read the error.  
- In **Settings → Pages**, ensure **Source** is **GitHub Actions** and that no error is shown.
