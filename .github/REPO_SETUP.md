# Repository setup

One-time GitHub configuration for this repo. Do it once with the **script** or the
**UI checklist** below — they apply the same settings.

## Option A — script (recommended)

Requires the [GitHub CLI](https://cli.github.com/) authenticated as a repo admin:

```bash
gh auth login
bash scripts/setup-repo.sh            # or: bash scripts/setup-repo.sh owner/repo
```

This enables auto-merge + branch cleanup and applies branch protection on `main`.

### PowerShell (no script)

```powershell
$REPO = "SekiroKenjii/vs-ext-boilerplate"
gh api -X PATCH "repos/$REPO" -F allow_auto_merge=true -F delete_branch_on_merge=true `
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=true
gh api -X PUT "repos/$REPO/branches/main/protection" --input .github/branch-protection.json
```

## Option B — UI checklist

**Settings → General → Pull Requests**

- [x] Allow squash merging · [ ] Allow merge commits · [x] Allow rebase merging
- [x] Allow auto-merge
- [x] Automatically delete head branches

**Settings → Branches → Add branch ruleset / protection rule** for `main`

- [x] Require a pull request before merging
- [x] Require status checks to pass → add **`verify`** (the CI job) · [x] Require branches to be up to date
- [x] Require linear history
- [x] Require conversation resolution before merging
- [x] Block force pushes · [x] Restrict deletions
- Reviews: optional — enable **Require approvals (1)** only if you have a team
  (then also approve Dependabot PRs in the auto-merge workflow).

## Releases & packages

Releases run on tag push (`v*`) via [`release.yml`](workflows/release.yml): it
builds, packages the `.vsix`, and attaches it to the **GitHub Release**.
Marketplace/Open VSX publishing is not enabled yet.

To enable it later, add these secrets (**Settings → Secrets and variables →
Actions**) and re-add the publish steps to `release.yml`:

| Secret     | Used for                  | Where to get it                                  |
| ---------- | ------------------------- | ------------------------------------------------ |
| `VSCE_PAT` | VS Marketplace publishing | Azure DevOps Personal Access Token (Marketplace) |
| `OVSX_PAT` | Open VSX publishing       | Open VSX access token                            |

Cut a release:

```bash
# bump version + changelog first (or use the /release command), then:
git tag v0.1.0 && git push origin v0.1.0
```

The `.vsix` is the published "package" and appears as a downloadable asset on each
Release. (GitHub Packages / npm isn't used: a VS Code extension ships as a VSIX,
and its name can't be npm-scoped without breaking the extension id.)

## Dependabot auto-merge

[`dependabot-auto-merge.yml`](workflows/dependabot-auto-merge.yml) auto-merges
**patch & minor** Dependabot PRs once the `verify` check passes; major bumps wait
for manual review. It depends on the auto-merge + branch-protection settings above.
