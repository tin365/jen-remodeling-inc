# Push this project to a new GitHub repo

## 1. Create the new repo on GitHub

1. Go to **https://github.com/new**
2. Set **Repository name** (e.g. `jen-remodeling-inc` or a new name).
3. Choose **Public**, leave **README**, **.gitignore**, and **license** **unchecked** (this project already has its own).
4. Click **Create repository**.

## 2. Point this project at the new repo and push

In the project folder, run the commands below. **Replace `YOUR_USERNAME` and `YOUR_NEW_REPO`** with your GitHub username and the new repo name.

```bash
cd "/Users/mac/New JeN/jen-remodeling-react"

# Remove the old remote
git remote remove origin

# Add the new repo as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git

# Push everything (main branch)
git push -u origin main
```

**Example** if your username is `tin365` and the new repo is `jen-remodeling-inc`:

```bash
git remote remove origin
git remote add origin https://github.com/tin365/jen-remodeling-inc.git
git push -u origin main
```

## 3. If the new repo has a different name (for GitHub Pages)

If the new repo is **not** named `jen-remodeling-inc`, update these so the site and assets load correctly:

- **next.config.js** – change the `repo` value to the new repo name.
- **package.json** – change `homepage` to `https://YOUR_USERNAME.github.io/YOUR_NEW_REPO`.

Then commit and push:

```bash
git add next.config.js package.json
git commit -m "Update repo name for new GitHub repo"
git push
```

## 4. Turn on GitHub Pages

1. In the new repo: **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy-pages.yml` will run on the next push and deploy the site to `https://YOUR_USERNAME.github.io/YOUR_NEW_REPO/`.

Done. The whole project is now in the new repo.
