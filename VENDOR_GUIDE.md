# Get listed as a Bitaxe seller

Mining got centralized. Bitaxe is one piece of bringing it back to individuals.

For that to work, vendors need to be trustworthy. Not because we say so — because miners depend on it. A vendor who sells counterfeits or disappears when there's a problem undermines the whole effort. A vendor who's honest, active in the community, and supports solo miners strengthens it.

This list isn't gatekeeping. It's identifying vendors who share the mission.

---

## Who belongs here

You're a good fit if:

- You sell **genuine Bitaxe hardware** — not clones, not unverified boards sold as Bitaxe
- Your shop is **live and real** — real products, real prices, real orders going out the door
- You have **some presence in the community** — Discord, X, forums, anywhere people can find you and vouch for you
- You have **no open reports** of fraud or counterfeits in the community

New to the community? That's okay — but expect the review to take longer while people get to know you.

---

## How to submit

### 1. Fork this repo

Hit **Fork** at the top right.

### 2. Add your two files

**`vendors/{your-slug}.json`**

The slug is your unique identifier. Lowercase letters and hyphens only — e.g. `pivotal-mining`.

```json
{
  "name": "Your Shop Name",
  "slug": "your-shop-name",
  "website": "https://yourshop.com",
  "region": "North America",
  "country": "USA",
  "logo": "logos/your-shop-name.png",
  "description": "One or two honest sentences about what you sell and who you serve.",
  "active": true,
  "social": {
    "x": "https://x.com/yourhandle",
    "instagram": "",
    "youtube": ""
  }
}
```

Valid regions: `North America` · `South America` · `Europe` · `Asia Pacific` · `Middle East & Africa`

**`logos/{your-slug}.png`**

Square format. PNG, JPG, or WEBP. Max **200 KB**.

### 3. Open a pull request

PR title: `Add vendor: Your Shop Name`

Fill in the PR template. The more context you give, the faster the review.

---

## What happens next

1. **CI runs** — checks your JSON against the schema, validates the logo, confirms the slug matches the filename. Fix anything it flags.
2. **Community weighs in** — anyone in the Bitaxe/OSMU community can comment, ask questions, or vouch for you. This is the point. The review is open.
3. **Team decides** — Skot, Wantclue, Derek or another core contributor merges or closes the PR, usually with a short explanation.

If your PR gets closed, re-apply once the issues raised are resolved.

---

## Keeping your listing current

Update your info — website, logo, description, socials — by opening a new PR with the changes.

To remove yourself: set `"active": false` in your JSON, or delete your files entirely. Either way triggers the sync and removes you from the site.

---

## Getting removed

The team can remove a listing if:

- You're no longer selling genuine Bitaxe hardware
- Confirmed reports of fraud or counterfeits emerge
- Your shop goes dark for an extended period

Removals go through the same PR process — transparent, on the record, visible to everyone.

---

## Questions

Jump into the [OSMU Discord](https://discord.gg/osmu) and ask in the Bitaxe channels.
