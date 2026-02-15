# Fix "404 - There isn't a GitHub Pages site here"

Do these steps **in order**. The site will appear at: **https://tin365.github.io/jen-remodeling-inc/**

---

## Step 1: Turn on GitHub Pages and set source

1. Open: **https://github.com/tin365/jen-remodeling-inc**
2. Click **Settings** (top tab bar).
3. In the left sidebar, click **Pages** (under "Code and automation").
4. Under **"Build and deployment"**:
   - **Source:** choose **"GitHub Actions"** (not "Deploy from a branch").
5. Do **not** select a branch or folder. Just set Source to GitHub Actions and leave the rest as is.

---

## Step 2: Run the deploy workflow

The workflow deploys when you push to `main`. Either:

**Option A – Push a small change (recommended)**  
From your project folder:

```bash
cd "/Users/mac/New JeN/jen-remodeling-react"
# Make a tiny change so we can push
echo "" >> README.md
git add README.md
git commit -m "Trigger GitHub Pages deploy"
git push
```

**Option B – Run the workflow manually**  
1. Go to: **https://github.com/tin365/jen-remodeling-inc/actions**
2. Click **"Deploy to GitHub Pages"** in the left sidebar.
3. Click **"Run workflow"** (right side) → **"Run workflow"** (green).
4. Wait 1–2 minutes until the run shows a green check.

---

## Step 3: Open the site

1. Wait **1–2 minutes** after the workflow finishes.
2. Open: **https://tin365.github.io/jen-remodeling-inc/**
3. If you still see 404, try a **hard refresh** (Cmd+Shift+R) or an **incognito/private** window.

---

## If it still shows 404

- In **Settings → Pages**, confirm **Source** is **GitHub Actions** and that it says the site is published (with the URL).
- In **Actions**, open the latest **"Deploy to GitHub Pages"** run and confirm all steps are green. If any step failed, read the error and fix it (e.g. build failure).
- Ensure your GitHub account allows Pages: **Settings** (your profile, not the repo) → **Pages** – confirm it’s enabled if that option exists.
