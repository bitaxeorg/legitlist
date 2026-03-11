# 🛒 Vendor Guide

### Get listed as a trusted Bitaxe hardware seller.

Mining got centralized. Bitaxe is one piece of bringing it back to individuals. For that to work, the hardware needs to be genuine — and the people selling it need to be accountable.

This list isn't a barrier. It's a signal. A vendor on this list has been reviewed by the community and cleared by the core team. That means something to miners making a purchase decision.

---

## ✅ Who belongs here

You're a good fit if:

- You sell **genuine Bitaxe hardware** — not clones, not unverified boards sold as Bitaxe
- Your shop is **live and active** — real products, real stock, real orders going out the door
- You have **some presence in the community** — Discord, X, forums, anywhere people can find and vouch for you
- You have **no open reports** of fraud or counterfeits in the community

New to the community? That's fine — but expect the review to take longer while people get to know you.

---

## 📋 How to submit

### 1. Fork this repo

Go to **[bitaxeorg/legitlist on GitHub](https://github.com/bitaxeorg/legitlist)** and hit **Fork** at the top right.

### 2. Add your two files

**`vendors/{your-slug}.json`**

The slug is your unique identifier — lowercase letters and hyphens only. Example: `pivotal-mining`.

Copy `vendors/_example.json` and fill it in:

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

Title your PR: `Add vendor: Your Shop Name`

Fill in the PR template. The more context you give, the faster the review.

---

## 🔍 What happens next

1. **CI validates your files** — checks JSON schema, logo size, slug match. Fix anything it flags before the review starts.
2. **Community weighs in** — anyone in the Bitaxe/OSMU community can comment, ask questions, or vouch for you. This is the point. The review is public.
3. **Core team decides** — Skot, Wantclue, Derek or another core contributor merges or closes the PR, usually with a short explanation.

If your PR gets closed, fix the issues raised and re-apply.

---

## 🔄 Keeping your listing current

Update your info — website, logo, description, socials — by opening a new PR with the changes. Same process, same review.

---

## ❌ Getting removed

A listing can be removed if:

- You're no longer selling genuine Bitaxe hardware
- Confirmed reports of fraud or counterfeits emerge
- Your shop goes dark for an extended period

Removals go through the same PR process — transparent, on the record, visible to everyone.

---

## 💬 Questions?

Jump into the [OSMU Discord](https://discord.gg/osmu) and ask in the Bitaxe channels.
