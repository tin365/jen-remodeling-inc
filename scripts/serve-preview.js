/**
 * Serves the production export so it works with basePath.
 * Copies out/ to out-preview/jen-remodeling-inc/ so that
 * http://localhost:3000/jen-remodeling-inc/ serves the site and assets resolve.
 *
 * Important: Run "npm run build" first, and ensure .env.local has
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY so the built
 * bundle can talk to Supabase (admin uploads, projects, etc.).
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const repo = 'jen-remodeling-inc'
const outDir = path.join(__dirname, '..', 'out')
const previewDir = path.join(__dirname, '..', 'out-preview', repo)

if (!fs.existsSync(outDir)) {
  console.error('Run "npm run build" first. The out/ folder was not found.')
  process.exit(1)
}

// Clear stale preview so CSS/JS from current build always match the HTML
if (fs.existsSync(previewDir)) {
  fs.rmSync(previewDir, { recursive: true })
}
fs.mkdirSync(previewDir, { recursive: true })
for (const name of fs.readdirSync(outDir)) {
  const src = path.join(outDir, name)
  const dest = path.join(previewDir, name)
  if (fs.statSync(src).isDirectory()) {
    fs.cpSync(src, dest, { recursive: true })
  } else {
    fs.copyFileSync(src, dest)
  }
}

console.log('Preview: open http://localhost:3000/' + repo + '/')
execSync('npx serve@latest out-preview -l 3000', { stdio: 'inherit', cwd: path.join(__dirname, '..') })
