# 🛒 Vendor Guide

### Get listed as a trusted Bitaxe hardware seller.

Mining got centralized. Bitaxe is one piece of bringing it back to individuals. For that to work, the hardware needs to be genuine — and the people selling it need to be accountable.

This list isn't a barrier. It's a signal. A vendor on this list has been reviewed by the community and cleared by the maintainers. That means something to miners making a purchase decision.

## ✅ Who belongs here

You're a good fit if:

- You sell **genuine Bitaxe hardware** — not clones, not unverified boards sold as Bitaxe
- Your shop is **live and active** — real products, real stock, real orders going out the door
- You have **some presence in the community** — Discord, X, forums, anywhere people can find and vouch for you
- You have **no open reports** of fraud or counterfeits in the community

New to the community? That's fine — but expect the review to take longer while people get to know you.

---

## Approval review criteria

Final inclusion in the legitlist is up to the maintainers.

These criteria are reviewed manually by maintainers. Meeting them improves approval likelihood but does not guarantee inclusion.

- You use the correct name: `Bitaxe`, not `BitAxe`
- Your product pages use real photos of the products you sell
- Your Bitaxe product pages link to `https://bitaxe.org`
- You do not sell Bitaxe-derived products in ways that violate Bitaxe open-source license terms

Selling closed-source miners is fine as long as they are not Bitaxe derivatives sold in violation of Bitaxe open-source license terms.

If you're unsure whether a product line is acceptable, ask the maintainers before submitting.

---

## 🧰 What you need before you start

Before you begin, make sure you have:

- your shop name
- your website URL
- your region and country
- your logo file
- at least one place where people can find you (for example X, Discord, Instagram, TikTok, or Nostr)
  (Discord or other links are fine in PR text; in JSON `social`, use only `x`, `instagram`, `youtube`, `tiktok`, `nostr`)

For your logo:
- use a square image
- **400×400 px recommended**
- max **200 KB**
- `.png`, `.jpg`, or `.webp`

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

Choose one short name for your shop, like `pivotal-mining`. Use that same name for your shop file, the `slug` field, and your logo file.

Slug format is strict: lowercase letters and numbers, separated by single hyphens only.

Valid: `my-shop`, `shop2`, `my-shop-2`
Invalid: `my--shop`, `-shop`, `shop-`, `my_shop`, `My-Shop`

Paste this example, then replace the sample details with your own shop details:

```json
{
  "name": "Your Shop Name",
  "slug": "your-shop-name",
  "website": "https://yourshop.com",
  "region": "Europe",
  "country": "Italy",
  "description": "Tell miners who you are — what you sell, where you ship, how long you've been at it. Keep it under 280 characters.",
  "active": true,
  "social": {
    "x": "https://x.com/yourhandle",
    "instagram": "",
    "youtube": "",
    "tiktok": "",
    "nostr": ""
  }
}
```

A few notes:
- `description` is optional, but recommended
- leave `active` as `true`
- `website` must be a full HTTPS URL (starting with `https://`) and cannot be empty
- do not add a `logo` field in JSON — logo is inferred from `logos/{slug}.png|jpg|webp`
- social links can be full HTTPS URLs or empty strings: `""`
- in the `social` section, use only: `x`, `instagram`, `youtube`, `tiktok`, `nostr`
- for `nostr`, use an HTTPS profile page URL (not a raw `npub...` or `nostr:` identifier)

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

For later changes, use `Update vendor: Your Shop Name`. For removals or deactivations, use `Remove vendor: Your Shop Name` or `Deactivate vendor: Your Shop Name`.

GitHub will show you a short form with pre-filled example fields.

Complete these sections:
- pick what this PR is (new listing, update, or removal)
- your shop name
- your website
- your region
- where people can find you in the community
- vendor confirmation (Yes/No)

Then click **Create pull request**.

### 5. What happens next

1. Automatic checks verify your files
2. The community can review and comment
3. The maintainers decide whether to merge your listing

If your PR is closed, you can fix the issues and open a new one.

Trust checks are manual. File checks are automatic.

---

## 🧯 Common errors (quick fixes)

If your PR check fails, use this checklist:

- **Invalid vendor filename**
  Your file must be in `vendors/`, end with `.json`, and use lowercase letters and numbers separated by single hyphens only
  Example: `your-shop-name.json`

- **Slug does not match filename**
  `slug` must be exactly the same as your filename (without `.json`)
  Example: file `pivotal-mining.json` -> `"slug": "pivotal-mining"`

- **Logo filename issue**
  Your logo must use the same slug and one supported extension (`.png`, `.jpg`, or `.webp`). Keep only one matching logo file.
  Example: `pivotal-mining.png`

- **Logo not found**
  Upload the logo file in the `logos/` folder

- **Logo exceeds 200 KB**
  Compress the image and upload it again

- **Website/social link error**
  Use full HTTPS URLs (starting with `https://`)

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

Use the PR title `Remove vendor: Vendor Name` for hard removals or `Deactivate vendor: Vendor Name` for soft removals.

---

## 💬 Questions?

Jump into the [OSMU Discord](https://discord.gg/osmu) and ask in the Bitaxe channels.
