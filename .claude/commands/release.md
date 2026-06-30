---
description: Prepare a release: bump version, update changelog, verify, and tag.
argument-hint: <major|minor|patch | x.y.z>
---

Use the `vscode-publishing` skill to prepare a release: $ARGUMENTS

1. Confirm the working tree is clean and on the default branch.
2. Update `version` in `package.json` (SemVer) and move the `CHANGELOG.md`
   "Unreleased" notes under the new version with today's date.
3. Verify: `pnpm run lint && pnpm run typecheck && pnpm test && pnpm run package`.
4. Show me the proposed `git commit` and `git tag vX.Y.Z` commands — do NOT push
   until I confirm. (Pushing the tag triggers the release workflow.)
