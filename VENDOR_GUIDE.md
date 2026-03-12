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

You can do all of this directly in your browser on GitHub. No coding tools needed.

### 1. Create your copy of this repo

Open this page:

**https://github.com/bitaxeorg/legitlist/fork**

Then click **Create fork**.

Quick answer:
- **Do I need to rename the fork?** No — keep the default name.

### 2. Create your shop file

In your fork, open the `vendors` folder.

Then click:
**Add file** → **Create new file**

Name your file like this:

`your-shop-name.json`

Example:

`pivotal-mining.json`

Now paste this template and replace the example values with your own:

```json
{
  "name": "Your Shop Name",
  "slug": "your-shop-name",
  "website": "https://yourshop.com",
  "region": "North America",
  "country": "USA",
  "logo": "logos/your-shop-name.png",
  "description": "Tell miners who you are — what you sell, where you ship, how long you've been at it. Keep it under 280 characters.",
  "active": true,
  "social": {
    "x": "https://x.com/yourhandle",
    "instagram": "",
    "youtube": ""
  }
}
```

A few notes:
- `description` is optional, but recommended
- leave `active` as `true`
- for social links, use the full URL or leave the field empty: `""`

Valid regions:
`Europe` · `North America` · `South America` · `Asia Pacific` · `Middle East` · `Africa` · `India`

Then click **Commit changes**.

### 3. Upload your logo

In your fork, open the `logos` folder.

Then click:
**Add file** → **Upload files**

Your logo must:
- use the same name as your shop file
- be square
- be **400×400 px recommended**
- be max **200 KB**
- be `.png`, `.jpg`, or `.webp`

Example:
- shop file: `vendors/pivotal-mining.json`
- logo file: `logos/pivotal-mining.png`

Then click **Commit changes**.

### 4. Open your pull request

Open your fork on GitHub and click:

**Contribute** → **Open pull request**

Use this title:

`Add vendor: Your Shop Name`

Then fill in the PR template and submit it.

### 5. What happens next

1. We check that your files are valid
2. The community can review and comment
3. The core team decides whether to merge your listing

If your PR is closed, you can fix the issues and open a new one.

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
