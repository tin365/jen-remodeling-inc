#!/usr/bin/env node
/**
 * Ensures .nojekyll exists in out/ before deploy.
 * Without it, GitHub Pages (Jekyll) ignores the _next folder → no CSS/JS loads.
 */
const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'out')
const nojekyll = path.join(outDir, '.nojekyll')

if (!fs.existsSync(outDir)) {
  console.error('Run "npm run build" first. out/ not found.')
  process.exit(1)
}

fs.writeFileSync(nojekyll, '', 'utf8')
console.log('✓ Added .nojekyll (required for GitHub Pages to serve _next/)')
