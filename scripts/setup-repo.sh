#!/usr/bin/env bash
# One-time GitHub repository configuration.
#
# Requires the GitHub CLI authenticated as a repo admin:
#   gh auth login
#
# Usage:
#   bash scripts/setup-repo.sh [owner/repo]   # defaults to SekiroKenjii/vs-ext-boilerplate
set -euo pipefail

REPO="${1:-SekiroKenjii/vs-ext-boilerplate}"
BRANCH="main"

echo "Configuring repository settings for $REPO ..."
# Enable auto-merge (needed by the Dependabot auto-merge workflow) and tidy
# merged branches automatically.
gh api -X PATCH "repos/$REPO" \
  -F allow_auto_merge=true \
  -F delete_branch_on_merge=true \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=true >/dev/null

echo "Applying branch protection on '$BRANCH' ..."
# Require the CI "verify" job to pass and the branch to be up to date; enforce a
# linear history and block force-pushes/deletions. Admins are NOT enforced, so
# the owner can still push directly when necessary. Add review requirements here
# if you work with a team (and approve Dependabot PRs in the workflow).
gh api -X PUT "repos/$REPO/branches/$BRANCH/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - >/dev/null <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["verify"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON

echo "Done. Verify at: https://github.com/$REPO/settings/branches"
