/**
 * sync-to-framer.mjs
 *
 * Reads all active vendor JSON files from ./vendors/ and syncs them
 * to the Framer CMS Managed Collection via the Framer Server API.
 *
 * Required environment variables:
 *   FRAMER_PROJECT_URL  — found in Framer > Project Settings > API
 *   FRAMER_API_KEY      — generated in Framer > Project Settings > API
 *
 * Run manually:  node scripts/sync-to-framer.mjs
 * Run in CI:     triggered by .github/workflows/sync-vendors.yml
 */

import { connect } from "framer-api"
import fs from "node:fs"
import path from "node:path"

// ─── Config ──────────────────────────────────────────────────────────────────

const LOGO_BASE =
  "https://cdn.jsdelivr.net/gh/bitaxeorg/legitlist@main/"

const COLLECTION_NAME = "Vendors"

// CMS field schema — edit with care; removing fields will lose CMS data
const FIELDS = [
  { id: "vendorName",   type: "string", name: "Vendor Name" },
  { id: "website",      type: "link",   name: "Website" },
  { id: "region",       type: "string", name: "Region" },
  { id: "country",      type: "string", name: "Country" },
  { id: "logoUrl",      type: "image",  name: "Logo" },
  { id: "description",  type: "string", name: "Description" },
  { id: "socialX",      type: "link",   name: "X / Twitter" },
  { id: "socialIg",     type: "link",   name: "Instagram" },
  { id: "socialYt",     type: "link",   name: "YouTube" },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadVendors() {
  const vendorsDir = path.resolve("./vendors")
  const files = fs
    .readdirSync(vendorsDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_")) // skip _schema.json, _example.json, etc.

  const vendors = files
    .map((f) => {
      const raw = fs.readFileSync(path.join(vendorsDir, f), "utf-8")
      return JSON.parse(raw)
    })
    .filter((v) => v.active === true)

  console.log(`📦 Loaded ${vendors.length} active vendor(s) from ${files.length} total file(s)`)
  return vendors
}

// FieldDataEntryInput helpers — each field must be a typed object, not a plain value
const str  = (value)        => ({ type: "string", value: value ?? "" })
const link = (value)        => ({ type: "link",   value: value || null })
const img  = (value)        => ({ type: "image",  value: value || null })

function vendorToItem(v) {
  return {
    id: v.slug,
    slug: v.slug,
    fieldData: {
      vendorName:  str(v.name),
      website:     link(v.website),
      region:      str(v.region),
      country:     str(v.country),
      logoUrl:     img(v.logo ? `${LOGO_BASE}${v.logo}` : `${LOGO_BASE}logos/_placeholder.png`),
      description: str(v.description),
      socialX:     link(v.social?.x),
      socialIg:    link(v.social?.instagram),
      socialYt:    link(v.social?.youtube),
    },
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { FRAMER_PROJECT_URL, FRAMER_API_KEY } = process.env

  if (!FRAMER_PROJECT_URL || !FRAMER_API_KEY) {
    console.error("❌  Missing FRAMER_PROJECT_URL or FRAMER_API_KEY env vars")
    process.exit(1)
  }

  console.log("🔌 Connecting to Framer…")
  const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_KEY)

  try {
    // ── Get or create the Managed Collection ──────────────────────────────
    // getManagedCollection() (singular) relies on "active" session state that
    // is unreliable in server-side / CI runs. Use getManagedCollections()
    // (plural) to list all managed collections in the project and find ours
    // by name — this is always reliable regardless of session history.
    console.log("🔍 Listing managed collections in project…")
    const allCollections = await framer.getManagedCollections()
    let collection = allCollections.find((c) => c.name === COLLECTION_NAME)

    if (collection) {
      console.log(`✅ Found existing collection: "${COLLECTION_NAME}" (id: ${collection.id})`)
    } else {
      console.log(`🆕 Collection "${COLLECTION_NAME}" not found — creating…`)
      collection = await framer.createManagedCollection(COLLECTION_NAME)
      console.log(`✅ Created collection: "${COLLECTION_NAME}" (id: ${collection.id})`)
    }

    // ── Load vendors first — fail before touching Framer state ───────────
    const vendors    = loadVendors()

    // ── Sync field schema ──────────────────────────────────────────────────
    console.log("🔧 Syncing field schema…")
    await collection.setFields(FIELDS)
    const newSlugs   = new Set(vendors.map((v) => v.slug))
    const existingIds = await collection.getItemIds()
    const toRemove   = existingIds.filter((id) => !newSlugs.has(id))

    if (toRemove.length > 0) {
      console.log(`🗑  Removing ${toRemove.length} stale item(s): ${toRemove.join(", ")}`)
      await collection.removeItems(toRemove)
    } else {
      console.log("✔  No stale items to remove")
    }

    // ── Upsert active vendors ─────────────────────────────────────────────
    const items = vendors.map(vendorToItem)
    console.log(`📤 Upserting ${items.length} vendor(s)…`)
    await collection.addItems(items) // addItems performs an upsert by id

    // ── Publish & deploy ──────────────────────────────────────────────────
    console.log("🚀 Publishing…")
    const { deployment } = await framer.publish()
    console.log(`🌐 Deploying (id: ${deployment.id})…`)
    await framer.deploy(deployment.id)

    console.log("🎉 Sync complete!")
  } finally {
    // Always disconnect — without this the script hangs indefinitely
    await framer.disconnect()
  }
}

main().catch((err) => {
  console.error("❌ Sync failed:", err)
  process.exit(1)
})
