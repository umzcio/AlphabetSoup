# Contributing to AI Alphabet Soup

Thanks for helping make AI less of an alphabet soup. This repo is the **dictionary data** — adding or fixing a term is the most valuable thing you can do here.

There are two paths. Pick whichever suits you.

## Path 1 — Suggest a term (easiest, no coding)

[Open a "Suggest a term" issue](../../issues/new?template=suggest-a-term.yml) and fill in the form. A maintainer will turn good suggestions into entries. This is perfect if you know a term that's missing but don't want to deal with JSON or pull requests.

## Path 2 — Add the term yourself (pull request)

1. **Create a file** in `terms/` named `<slug>.json`, where `<slug>` is a lowercase, hyphen-separated id (e.g. `mixture-of-experts.json`).
2. **Fill in the fields** (see the schema below). The `slug` inside the file must match the filename.
3. **Open a pull request.** A GitHub Action validates your file against `schema.json` automatically. If it fails, the checks will tell you what's wrong.

You can do all of this from GitHub's web editor — no need to clone anything. Browse to the `terms/` folder, click **Add file → Create new file**, and GitHub will offer to open a PR for you.

## The term format

```json
{
  "slug": "mixture-of-experts",
  "term": "Mixture of Experts",
  "acronym": "MoE",
  "category": "Architectures",
  "short": "A model with many expert sub-networks, only a few of which run per token.",
  "definition": "A Mixture of Experts model contains many specialized sub-networks ('experts') and a router that activates only a small subset for each token ...",
  "example": null,
  "related": ["transformer", "llm"]
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | yes | Lowercase, hyphen-separated. Must match the filename and be unique. |
| `term` | yes | The display name, e.g. `vLLM`. |
| `acronym` | no | Expansion or alternate name, or `null`. |
| `category` | yes | Must be one of the categories in [`categories.json`](categories.json). |
| `short` | yes | One-line summary, **140 characters max** — shown on cards and lists. |
| `definition` | yes | The full plain-language definition (a short paragraph). |
| `example` | no | A code snippet or concrete example, or `null`. |
| `related` | yes | An array of slugs of related terms (can be empty `[]`). |

## Categories

Use one of these exactly (see [`categories.json`](categories.json)):

- Foundations
- Architectures
- Training
- Optimization
- Inference & Serving
- Patterns
- Prompting
- Hardware & Systems
- Organizations
- Models & Products
- Frameworks & Tools
- Safety & Alignment
- Evaluation
- Multimodal
- Data

If a term genuinely doesn't fit any category, propose a new one in your PR description and we'll discuss it.

## Style rules

These keep the dictionary consistent and genuinely useful:

- **Plain language first.** Write so a smart non-specialist understands it. Define jargon you can't avoid.
- **Be accurate and current.** Prefer how the term is actually used in 2025+, not just its textbook origin.
- **Keep `short` to one clean sentence.** It's the hook; the `definition` carries the detail.
- **No marketing.** Describe what something *is* and *does*, not why it's great.
- **Link related terms** by slug — it's what powers the "Related terms" connections on the site.

## How contributions go live

Maintainers review every pull request. Once merged, the term ships to the live site on the next deploy. Contributors are recorded in the repo's history — thank you for adding to the soup.

## License

By contributing, you agree your contribution is licensed under [CC BY 4.0](LICENSE), the same license as the rest of the dictionary data.
