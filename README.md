# legitlist

The community-reviewed list of vendors selling genuine Bitaxe hardware.

Listings are managed via pull requests — open, transparent, and on the record. The community discusses, the Bitaxe core team decides.

→ **Want to get listed?** Read [VENDOR_GUIDE.md](VENDOR_GUIDE.md) and open a PR.
→ **Want to report a vendor?** [Open an issue](../../issues/new/choose).

---

## How it works

```
Vendor opens PR → CI validates files → Community reviews → Team merges or closes → Site updates automatically
```

Every vendor is a JSON file in `vendors/`. When a PR merges into `main`, a GitHub Action syncs the data to the Bitaxe website with no manual steps.

---

## Repo structure

```
legitlist/
├── vendors/
│   ├── _schema.json       # JSON Schema — all vendor files must pass this
│   ├── _example.json      # Template to copy when adding a vendor
│   └── {slug}.json        # One file per vendor
├── logos/
│   └── {slug}.png         # Square image, max 200 KB
├── scripts/
│   ├── sync-to-framer.mjs # Syncs vendors to Framer CMS
│   └── validate-all.mjs   # Run validation locally
└── .github/
    ├── workflows/
    │   ├── sync-vendors.yml    # Runs on merge to main
    │   └── validate-vendor.yml # Runs on every PR
    ├── ISSUE_TEMPLATE/
    │   └── report-vendor.yml   # For reporting a listed vendor
    └── pull_request_template.md
```

---

## For maintainers

### First-time setup

Add these two secrets under **Settings → Secrets and variables → Actions**:

| Secret | Where to find it |
|---|---|
| `FRAMER_PROJECT_URL` | Framer → Project Settings → API |
| `FRAMER_API_KEY` | Framer → Project Settings → API → Generate Key |

Then trigger the first sync manually: **Actions → Sync Vendors → Framer CMS → Run workflow**. This creates the Managed Collection in Framer.

### Adding or updating a vendor

1. Create `vendors/{slug}.json` — copy from `vendors/_example.json`
2. Add logo at `logos/{slug}.png` (square, max 200 KB)
3. Open a PR — CI validates automatically
4. Merge → sync and deploy run automatically

### Removing a vendor

**Soft remove** — set `"active": false` in the JSON. File stays, vendor disappears from the site.
**Hard remove** — delete the JSON and logo files.

Both trigger the sync on merge.

### Local development

```bash
npm install
npm run validate   # validate all vendor files
npm run sync       # manual sync (needs .env with FRAMER_PROJECT_URL and FRAMER_API_KEY)
```

---

## License

MIT
