// Validates every term file in terms/ against schema.json.
// Also checks: filename matches slug, slugs are unique, category is known,
// and related[] entries point to existing terms.
import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = process.cwd();
const schema = JSON.parse(fs.readFileSync(path.join(root, "schema.json"), "utf8"));
const { categories } = JSON.parse(fs.readFileSync(path.join(root, "categories.json"), "utf8"));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const termsDir = path.join(root, "terms");
const files = fs.readdirSync(termsDir).filter((f) => f.endsWith(".json"));

let errors = [];
const slugs = new Set();
const allSlugs = new Set(files.map((f) => f.replace(/\.json$/, "")));

for (const file of files) {
  const full = path.join(termsDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${e.message}`);
    continue;
  }

  if (!validate(data)) {
    for (const err of validate.errors) {
      errors.push(`${file}: ${err.instancePath || "(root)"} ${err.message}`);
    }
  }

  const expectedSlug = file.replace(/\.json$/, "");
  if (data.slug !== expectedSlug) {
    errors.push(`${file}: slug "${data.slug}" must match filename "${expectedSlug}"`);
  }
  if (slugs.has(data.slug)) {
    errors.push(`${file}: duplicate slug "${data.slug}"`);
  }
  slugs.add(data.slug);

  if (data.category && !categories.includes(data.category)) {
    errors.push(`${file}: category "${data.category}" is not in categories.json`);
  }

  if (Array.isArray(data.related)) {
    for (const rel of data.related) {
      if (!allSlugs.has(rel)) {
        errors.push(`${file}: related slug "${rel}" has no matching file in terms/`);
      }
    }
  }
}

if (errors.length) {
  console.error(`\n✗ Validation failed with ${errors.length} problem(s):\n`);
  for (const e of errors) console.error("  - " + e);
  console.error("");
  process.exit(1);
} else {
  console.log(`✓ All ${files.length} term files are valid.`);
}
