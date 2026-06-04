/**
 * validate-pr.mjs
 *
 * Validates PR title/body hygiene using the GitHub pull_request event payload.
 * Run in CI with: npm run validate:pr
 */

import fs from "node:fs"

const eventPath = process.env.GITHUB_EVENT_PATH

if (!eventPath) {
  console.log("Skipping PR metadata validation: GITHUB_EVENT_PATH is not set")
  process.exit(0)
}

let payload
try {
  payload = JSON.parse(fs.readFileSync(eventPath, "utf-8").replace(/^\uFEFF/, ""))
} catch (err) {
  console.error(`Failed to read GitHub event payload: ${err.message}`)
  process.exit(1)
}

const pr = payload.pull_request
if (!pr) {
  console.log("Skipping PR metadata validation: event is not a pull_request")
  process.exit(0)
}

const title = pr.title.trim()
const body = pr.body || ""
const errors = []
const titleMatch = title.match(/^(Add vendor|Update vendor|Remove vendor|Deactivate vendor): .+/)
const prType = titleMatch?.[1]
const changedFiles = await getChangedFiles()
const touchesVendorListing = changedFiles?.some((file) => file.startsWith("vendors/") || file.startsWith("logos/"))

if (changedFiles && !touchesVendorListing && !titleMatch) {
  console.log("Skipping PR metadata validation: PR does not touch vendor listings")
  process.exit(0)
}

if (!titleMatch) {
  errors.push("PR title must start with one of: 'Add vendor:', 'Update vendor:', 'Remove vendor:', or 'Deactivate vendor:'")
}

const placeholders = [
  "Your shop name",
  "https://yourshop.com",
  "Your X, Discord, Instagram, TikTok, Nostr, or other public link",
]

for (const placeholder of placeholders) {
  if (body.includes(placeholder)) {
    errors.push(`Replace PR template placeholder: ${placeholder}`)
  }
}

if (!/\|\s*\*\*Shop name\*\*\s*\|\s*\S/.test(body)) {
  errors.push("PR body must include a completed Shop name row")
}

if (!/\|\s*\*\*Website\*\*\s*\|\s*https:\/\/\S+/.test(body)) {
  errors.push("PR body must include a completed HTTPS Website row")
}

if (!/\|\s*\*\*Where to find you in the community\*\*\s*\|\s*\S/.test(body)) {
  errors.push("PR body must include a completed community contact row")
}

const confirmationRows = [
  "I sell genuine Bitaxe hardware",
  "My shop is live and active",
  "I am reachable in the community",
  "I use the correct name `Bitaxe` on my Bitaxe product pages",
  "My Bitaxe product pages use real product photos",
  "My Bitaxe product pages link to `https://bitaxe.org`",
  "I do not sell Bitaxe-derived products in ways that violate Bitaxe open-source license terms",
  "I am not aware of open fraud or counterfeit reports about my shop",
  "I understand listings can be removed if confirmed issues arise",
]

if (prType === "Add vendor" || prType === "Update vendor") {
  for (const label of confirmationRows) {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const rowPattern = new RegExp(`\\|\\s*${escapedLabel}\\s*\\|\\s*(Yes|No)\\s*\\|`, "i")
    if (!rowPattern.test(body)) {
      errors.push(`Vendor confirmation must be answered Yes/No: ${label}`)
    }
  }
}

if (errors.length > 0) {
  console.error("PR metadata validation failed:")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log("PR metadata is valid")

async function getChangedFiles() {
  const filesUrl = pr._links?.self?.href ? `${pr._links.self.href}/files` : null
  const token = process.env.GITHUB_TOKEN

  if (!filesUrl || !token) return null

  try {
    const response = await fetch(filesUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (!response.ok) {
      console.warn(`Could not fetch PR files (${response.status}); validating title/body only`)
      return null
    }

    const files = await response.json()
    return files.map((file) => file.filename)
  } catch (err) {
    console.warn(`Could not fetch PR files; validating title/body only: ${err.message}`)
    return null
  }
}
