#!/bin/bash
# Push this project to a new GitHub repo.
# Usage: ./push-to-new-repo.sh YOUR_USERNAME YOUR_NEW_REPO [--force]
# Example: ./push-to-new-repo.sh tin365 jen-remodeling-inc
# Use --force to overwrite remote (e.g. after creating a new repo with same name).

set -e
USERNAME="${1:?Usage: ./push-to-new-repo.sh YOUR_USERNAME YOUR_NEW_REPO [--force]}"
REPO="${2:?Usage: ./push-to-new-repo.sh YOUR_USERNAME YOUR_NEW_REPO [--force]}"
FORCE=""
[[ "${3:-}" == "--force" ]] && FORCE="--force"

cd "$(dirname "$0")"
echo "Removing old origin..."
git remote remove origin 2>/dev/null || true
echo "Adding new origin: https://github.com/${USERNAME}/${REPO}.git"
git remote add origin "https://github.com/${USERNAME}/${REPO}.git"
echo "Pushing main to origin..."
git push -u origin main $FORCE
echo "Done. Repo: https://github.com/${USERNAME}/${REPO}"
echo "After enabling Pages (Settings → Pages → Source: GitHub Actions), site will be at: https://${USERNAME}.github.io/${REPO}/"
