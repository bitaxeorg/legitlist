# 🔧 Maintainers Guide

Internal reference for the legitlist core team. Not vendor-facing.

---

## 🏗️ How the system works

When a PR merges into `main`, a GitHub Action syncs all vendor data to the Framer CMS. Visibility is controlled by the `vendorActive` field (derived from JSON `active`), so only active vendors should be shown on the site.

```
PR merged → GitHub Action triggers → Vendor data synced to Framer → Site deploys
```

---

## 📁 Repo structure

```
legitlist/
├── vendors/
│   ├── _schema.json          # JSON Schema — all vendor files must pass this
│   ├── _example.json         # Template — skipped by sync (filename starts with _)
│   └── {slug}.json           # One file per vendor
├── logos/
│   └── {slug}.{ext}          # Square 400×400px, max 200 KB — png, jpg, webp
├── scripts/
│   ├── sync-to-framer.mjs    # Syncs vendors to Framer CMS on merge
│   └── validate-all.mjs      # Local validation script
└── .github/
    ├── workflows/
    │   ├── sync-vendors.yml       # Runs on merge to main
    │   └── validate-vendor.yml    # Runs on every PR
    ├── ISSUE_TEMPLATE/
    │   └── report-vendor.yml      # For reporting a listed vendor
    └── pull_request_template.md
```

> Files prefixed with `_` are internal — skipped by both sync and validation.

---

## ⚙️ First-time setup

**1. Add GitHub Secrets**

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Where to find it |
|---|---|
| `FRAMER_PROJECT_URL` | Framer → Project Settings → API |
| `FRAMER_API_KEY` | Framer → Project Settings → API → Generate Key |

**2. Initialize the Framer Managed Collection**

Trigger the first sync manually: **Actions → Sync Vendors to Framer CMS → Run workflow**

This creates the Managed Collection in Framer with all fields. Only needs to be done once.

---

## ➕ Adding or updating a vendor

1. Create `vendors/{slug}.json` — copy from `vendors/_example.json` (`slug` uses lowercase letters, numbers, and hyphens only; no `logo` field in JSON)
2. Add logo at `logos/{slug}.{ext}` (square 400×400px recommended, max 200 KB — png, jpg, webp)
3. Social keys supported by schema: `x`, `instagram`, `youtube`, `tiktok`, `nostr`
4. Open a PR — CI validates automatically
5. Merge → sync and deploy run automatically

---

## Vendor review checklist

Before merging a vendor PR, confirm:

- The vendor sells genuine Bitaxe hardware and is not misrepresenting clones or counterfeit products
- The shop is live and active
- The vendor is reachable in public community channels
- There are no unresolved fraud or counterfeit reports
- `Bitaxe` is spelled correctly across the shop page and materials
- Product photos appear real and specific to the seller
- Each Bitaxe product page links to `https://bitaxe.org`
- No Bitaxe-derived products are being sold in violation of Bitaxe open-source license terms

Selling closed-source miners is acceptable if they are not Bitaxe derivatives sold in violation of Bitaxe open-source license terms.

If there is uncertainty, leave the PR open and ask for clarification before merging.

---

## 🗑️ Removing a vendor

**Soft remove** — set `"active": false` in the JSON. File stays in repo, vendor remains in Framer CMS, and the site should hide it by filtering `vendorActive = "true"` only.

**Hard remove** — only do this together with manual cleanup in Framer. The sync runs in soft-sync mode and does not delete stale CMS items automatically.

Both trigger the sync on merge. Both are transparent — the change is visible in Git history.

---

## 💻 Local development

```bash
npm install
npm run validate      # validate all vendor files locally
npm run validate:pr   # validates PR title/body in GitHub Actions; skips locally without GITHUB_EVENT_PATH
npm run sync          # manual sync (requires FRAMER_PROJECT_URL and FRAMER_API_KEY exported in your shell)
```
