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
const files = fs
  .readdirSync(vendorsDir)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_")) // skip _schema.json, _example.json, etc.

let errors = 0

for (const file of files) {
  const filePath = path.join(vendorsDir, file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))

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

  // Logo — missing is a warning (placeholder used), oversized is an error
  const logoPath = path.resolve(data.logo)
  if (!fs.existsSync(logoPath)) {
    console.warn(`⚠️  ${file} — Logo not found: ${data.logo} (placeholder will be used)`)
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
