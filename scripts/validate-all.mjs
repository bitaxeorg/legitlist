/**
 * validate-all.mjs
 *
 * Local validation script — same checks as the CI workflow.
 * Run with:  npm run validate
 */

import Ajv from "ajv"
import addFormats from "ajv-formats"
import fs from "node:fs"
import path from "node:path"

const ajv = new Ajv({ strict: false, allErrors: true })
addFormats(ajv)

const schemaPath = path.resolve("./vendors/_schema.json")
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"))
const validate = ajv.compile(schema)

const vendorsDir = path.resolve("./vendors")
const allVendorEntries = fs.readdirSync(vendorsDir)
const files = allVendorEntries
  .filter((f) => f.endsWith(".json") && !f.startsWith("_")) // skip _schema.json, _example.json, etc.

let errors = 0

// Guardrail: reject unexpected non-JSON vendor files (e.g. missing .json extension)
for (const file of allVendorEntries) {
  if (file.startsWith("_")) continue
  if (!file.endsWith(".json")) {
    console.error(`❌ ${file} — Invalid vendor filename. Vendor files must end with .json`)
    errors++
    continue
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(file)) {
    console.error(`❌ ${file} — Invalid vendor filename. Use lowercase letters, numbers, and hyphens only`) // no spaces, underscores, uppercase, or extra dots
    errors++
  }
}

for (const file of files) {
  const filePath = path.join(vendorsDir, file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch (err) {
    console.error(`❌ ${file} — Invalid JSON: ${err.message}`)
    errors++
    continue
  }

  const valid = validate(data)
  if (!valid) {
    console.error(`\n❌ ${file} — Schema errors:`)
    validate.errors.forEach((e) => console.error(`   ${e.instancePath} ${e.message}`))
    errors++
    continue
  }

  // Slug must match filename
  const expectedSlug = path.basename(file, ".json")
  if (data.slug !== expectedSlug) {
    console.error(`❌ ${file} — Slug '${data.slug}' does not match filename '${expectedSlug}'`)
    errors++
    continue
  }

  // Logo filename must match slug (e.g. pivotal-mining.png)
  const logoName = path.parse(data.logo).name
  if (logoName !== data.slug) {
    console.error(`❌ ${file} — Logo filename '${logoName}' does not match slug '${data.slug}'`)
    errors++
    continue
  }

  // Logo is required; missing or oversized is an error
  const logoPath = path.resolve("./logos", data.logo)
  if (!fs.existsSync(logoPath)) {
    console.error(`❌ ${file} — Logo not found: ${data.logo}`)
    errors++
    continue
  } else {
    const size = fs.statSync(logoPath).size
    if (size > 204800) {
      console.error(`❌ ${file} — Logo exceeds 200 KB (${size} bytes)`)
      errors++
      continue
    }
  }

  console.log(`✅ ${file}`)
}

console.log(`\n${errors === 0 ? "🎉 All valid!" : `❌ ${errors} error(s) found`}`)
if (errors > 0) process.exit(1)
