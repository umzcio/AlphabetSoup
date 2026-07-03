---
name: curate-terms
description: Keep the AI Alphabet Soup dictionary current — discover genuinely new AI terms worth adding and flag existing definitions that have gone stale, then open ONE pull request with the drafted/updated term JSONs for human review. Use when asked to "curate", "update the dictionary", "find new terms", "check for stale definitions", "stay current", or when run on a schedule.
---

# Curate Terms — keep the dictionary current

You maintain the **content data** for AI Alphabet Soup: one JSON file per term in `terms/<slug>.json`. Your job on each run is to **propose** improvements as a pull request — never to publish directly. A human reviews and merges. Merging auto-deploys the site.

**Audience reminder:** the readers are non-experts. Every word you write must be plain-language and jargon-light. If a smart 15-year-old couldn't follow it, rewrite it.

## Hard rules (do not violate)

1. **Propose, never publish.** Work on a new branch and open a PR. Never commit to `main`, never merge.
2. **Cap each run at 8 candidates total** (new + updated combined) so review stays manageable. Quality over volume. If you found more, list the extras in the PR body as "next batch".
3. **Never duplicate an existing term.** Load every existing slug first and check against it (including obvious synonyms/acronyms) before drafting anything new.
4. **Every field must validate against `schema.json`.** In particular: `slug` matches the filename and `^[a-z0-9]+(?:-[a-z0-9]+)*$`; `category` is EXACTLY one of the strings in `categories.json`; `short` ≤ 140 chars; `related` entries are slugs that already exist (or that you are adding in this same PR).
5. **Accuracy over recency.** If you can't state something confidently and correctly in plain language, don't add it. A wrong definition on a public dictionary is worse than a missing one.

## Process

### 1. Load current state (always first)
```bash
ls terms/*.json | wc -l                        # how many terms exist
node -e 'const fs=require("fs");const s=fs.readdirSync("terms").filter(f=>f.endsWith(".json")).map(f=>f.replace(".json",""));console.log(s.join("\n"))' > /tmp/existing-slugs.txt
cat categories.json                             # the ONLY allowed categories
cat schema.json                                 # the exact field contract
```
Read 2–3 existing `terms/*.json` files to match the house tone and depth (one short line + one plain paragraph; `related` cross-links; `acronym`/`example` null when N/A).

### 2. Discover — what's genuinely new or changed
Research what has emerged or shifted in AI recently (new model families, techniques, architectures, tools, safety/eval concepts, widely-used acronyms). Prefer terms that:
- a non-expert would plausibly encounter and need explained, AND
- are missing from `/tmp/existing-slugs.txt` (check synonyms too).

Skip: vendor marketing names with no conceptual content, ephemeral hype with no staying power, and anything you can't define accurately.

### 3. Freshness — flag stale existing definitions
Scan for definitions that may have drifted: references to a model/tool as "newest/latest" that no longer is, deprecated techniques described as current, or facts that have changed. Only propose an edit when you can state the corrected version confidently. Preserve the term's slug, structure, and `related` links; change only what's inaccurate.

### 4. Draft — in the exact schema
For each new term, create `terms/<slug>.json`:
```json
{
  "slug": "example-slug",
  "term": "Display Name",
  "acronym": "Full Expansion Or Alternate Name",
  "category": "One Of categories.json",
  "short": "One plain-language line, <=140 chars, no jargon.",
  "definition": "A short plain-language paragraph: what it is, why it matters, how it connects. Accurate, jargon-light.",
  "example": null,
  "related": ["existing-slug-1", "existing-slug-2"]
}
```
`acronym`/`example` are `null` when there's nothing real to put there. Pick 2–5 `related` slugs that genuinely exist (verify against `/tmp/existing-slugs.txt` or files added in this PR).

### 5. Validate BEFORE opening the PR
Run the repo's own validator so the PR passes CI on the first try:
```bash
node scripts/validate.mjs 2>/dev/null || node scripts/*validate* 2>/dev/null || true
# Fallback per-file check if no validate script:
node -e '
const fs=require("fs");
const cats=new Set(JSON.parse(fs.readFileSync("categories.json","utf8")).categories);
const slugs=new Set(fs.readdirSync("terms").filter(f=>f.endsWith(".json")).map(f=>f.replace(".json","")));
let bad=0;
for(const f of fs.readdirSync("terms").filter(f=>f.endsWith(".json"))){
  const t=JSON.parse(fs.readFileSync("terms/"+f,"utf8"));
  const errs=[];
  if(t.slug!==f.replace(".json","")) errs.push("slug!=filename");
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.slug)) errs.push("bad slug");
  if(!cats.has(t.category)) errs.push("category not in categories.json: "+t.category);
  if(!t.short||t.short.length>140) errs.push("short missing or >140");
  if(!t.definition) errs.push("no definition");
  for(const r of (t.related||[])) if(!slugs.has(r)) errs.push("related not found: "+r);
  if(errs.length){bad++;console.log(f+": "+errs.join(", "));}
}
console.log(bad?("FAIL: "+bad+" file(s)"):"OK: all term files valid");
'
```
Fix anything it reports. Do not open a PR with a failing validation.

### 6. Open ONE pull request (do not merge)
```bash
git checkout -b curate/$(date +%Y-%m-%d)-terms   # note: if Date is unavailable, use a descriptive branch name
git add terms/
git commit -m "curate: N new terms + M freshness fixes"
git push -u origin HEAD
gh pr create --base main --title "Curation: <N> new + <M> updated terms" --body "<see PR body template>"
```

**PR body template** — make review fast:
```
## New terms (N)
- **Term Name** (`slug`, Category) — one-line why it belongs. [sources if researched]

## Freshness fixes (M)
- **Term Name** (`slug`) — what was stale → what changed, and why.

## Next batch (didn't fit the 8-cap)
- candidate, candidate, …

All files pass `schema.json` validation. Nothing here is live until you merge.
```

### 7. Report back
Summarize: branch, PR URL, count of new vs updated, and anything you were unsure about (flag low-confidence items explicitly so the human scrutinizes them).

## When run on a schedule (unattended)
Same process. If a step genuinely blocks (e.g., `gh` not authenticated), stop and leave a clear note rather than committing to `main` or force-anything. A run that opens a small, correct PR is a success; a run that finds nothing worth adding and says so is also a success — do NOT invent terms to hit a quota.
