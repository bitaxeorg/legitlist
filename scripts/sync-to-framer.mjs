/**
 * sync-to-framer.mjs
 *
 * Reads all vendor JSON files from ./vendors/ and syncs them
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
import { spawnSync } from "node:child_process"

// ─── Config ──────────────────────────────────────────────────────────────────

const ASSET_REF =
  process.env.LEGITLIST_ASSET_REF || process.env.GITHUB_SHA || "main"

const LOGO_BASE =
  `https://cdn.jsdelivr.net/gh/bitaxeorg/legitlist@${ASSET_REF}/`

const COLLECTION_NAME = "Vendors"

const RETRY_ATTEMPTS = 4
const RETRY_DELAY_MS = 10000
const RETRY_MAX_DELAY_MS = 60000

// CMS field schema — edit with care; removing fields will lose CMS data
const FIELDS = [
  { id: "vendorName",   type: "string",  name: "Vendor Name" },
  { id: "website",      type: "link",    name: "Website" },
  { id: "region",       type: "string",  name: "Region" },
  { id: "country",      type: "string",  name: "Country" },
  { id: "vendorActive", type: "string",  name: "Active" },
  { id: "logoUrl",      type: "image",   name: "Logo" },
  { id: "description",  type: "string",  name: "Description" },
  { id: "socialX",      type: "link",    name: "X / Twitter" },
  { id: "socialIg",     type: "link",    name: "Instagram" },
  { id: "socialYt",     type: "link",    name: "YouTube" },
  { id: "socialTt",     type: "link",    name: "TikTok" },
  { id: "socialNostr",  type: "link",    name: "Nostr" },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadVendors() {
  const vendorsDir = path.resolve("./vendors")
  const files = fs
    .readdirSync(vendorsDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_")) // skip _schema.json, _example.json, etc.

  const vendors = files.map((f) => {
    const raw = fs.readFileSync(path.join(vendorsDir, f), "utf-8")
    return JSON.parse(raw)
  })

  const activeCount = vendors.filter((v) => v.active === true).length
  console.log(`📦 Loaded ${vendors.length} vendor(s) from ${files.length} total file(s) — ${activeCount} active`)
  return vendors
}

// FieldDataEntryInput helpers — each field must be a typed object, not a plain value
const str  = (value)        => ({ type: "string", value: value ?? "" })
const link = (value)        => ({ type: "link",   value: value || null })
const img  = (value)        => ({ type: "image",  value: value || null })

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function errorText(err) {
  if (!err) return "Unknown error"
  if (typeof err === "string") return err
  return [err.message, err.cause?.message, err.stack].filter(Boolean).join("\n")
}

async function withRetry(label, fn, attempts = RETRY_ATTEMPTS, baseDelayMs = RETRY_DELAY_MS) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      const details = errorText(err)
      if (attempt === attempts) break
      const retryDelayMs = Math.min(baseDelayMs * attempt, RETRY_MAX_DELAY_MS)
      const message = err?.message || String(err)
      console.warn(`⚠️  ${label} failed (attempt ${attempt}/${attempts}): ${message}`)
      console.warn(`↳ Details: ${details.split("\n")[0]}`)
      console.warn(`↻ Retrying in ${Math.round(retryDelayMs / 1000)}s...`)
      await sleep(retryDelayMs)
    }
  }
  throw lastError
}

function vendorToItem(v) {
  return {
    id: v.slug,
    slug: v.slug,
    fieldData: {
      vendorName:  str(v.name),
      website:     link(v.website),
      region:      str(v.region),
      country:     str(v.country),
      vendorActive:str(v.active ? "true" : "false"),
      logoUrl:     img(`${LOGO_BASE}logos/${v.logo}`),
      description: str(v.description),
      socialX:     link(v.social?.x),
      socialIg:    link(v.social?.instagram),
      socialYt:    link(v.social?.youtube),
      socialTt:    link(v.social?.tiktok),
      socialNostr: link(v.social?.nostr),
    },
  }
}

function runValidationPreflight() {
  console.log("🧪 Running validation preflight…")
  const validatorPath = path.resolve("./scripts/validate-all.mjs")
  const result = spawnSync(process.execPath, [validatorPath], { stdio: "inherit" })

  if (result.status !== 0) {
    throw new Error("Preflight validation failed. Fix vendor data before syncing.")
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { FRAMER_PROJECT_URL, FRAMER_API_KEY } = process.env

  if (!FRAMER_PROJECT_URL || !FRAMER_API_KEY) {
    console.error("❌  Missing FRAMER_PROJECT_URL or FRAMER_API_KEY env vars")
    process.exit(1)
  }

  runValidationPreflight()

  console.log("🔌 Connecting to Framer…")
  const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_KEY)
  let mainError = null

  try {
    console.log(`🖼️  Logo asset ref: ${ASSET_REF}`)

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
    console.log("ℹ️  Soft sync mode — stale items are not deleted automatically")

    // ── Upsert all vendors (visibility controlled by active) ──────────────
    const items = vendors.map(vendorToItem)
    console.log(`📤 Upserting ${items.length} vendor(s)…`)
    await collection.addItems(items) // addItems performs an upsert by id

    // ── Publish & deploy ──────────────────────────────────────────────────
    const changedPaths = await framer.getChangedPaths()
    const changedCount =
      changedPaths.added.length +
      changedPaths.removed.length +
      changedPaths.modified.length

    if (changedCount === 0) {
      console.log("ℹ️  No changed paths since last publish — skipping publish/deploy")
      return
    }

    console.log(
      `🧭 Changed paths — added: ${changedPaths.added.length}, removed: ${changedPaths.removed.length}, modified: ${changedPaths.modified.length}`
    )
    console.log("🚀 Publishing…")

    let deployment
    try {
      ;({ deployment } = await withRetry("Publish", () => framer.publish()))
    } catch (err) {
      console.error("❌ Publish failed with pending changes still present")
      console.error(
        `🧭 Pending paths — added: ${changedPaths.added.length}, removed: ${changedPaths.removed.length}, modified: ${changedPaths.modified.length}`
      )
      throw err
    }

    console.log(`🌐 Deploying (id: ${deployment.id})…`)
    await withRetry("Deploy", () => framer.deploy(deployment.id))

    console.log("🎉 Sync complete!")
  } catch (err) {
    mainError = err
    throw err
  } finally {
    // Always disconnect — without this the script hangs indefinitely
    try {
      await framer.disconnect()
    } catch (disconnectError) {
      if (mainError) {
        console.error("⚠️  Disconnect failed after an earlier sync error:", disconnectError?.message || disconnectError)
      } else {
        throw disconnectError
      }
    }
  }
}

main().catch((err) => {
  console.error("❌ Sync failed:", err?.message || err)
  if (err?.stack) {
    console.error(err.stack)
  }
  if (err?.cause) {
    console.error("Cause:", err.cause)
  }
  process.exit(1)
})
