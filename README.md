# AI Alphabet Soup — the dictionary

The open data behind **[AI Alphabet Soup](https://alphabetsoup.ai/)**: a clear, searchable dictionary of AI terms, written in plain language.

Every term swimming in AI's acronym broth — from `skills` and `loop engineering` to `vLLM`, `SGLang`, `TensorRT-LLM`, `CUDA`, and `NIM` — lives here as a small JSON file you can read, search, and contribute to.

## What's in here

```
terms/            One JSON file per term (the dictionary)
categories.json   The canonical list of categories
schema.json       The JSON Schema every term must satisfy
CONTRIBUTING.md   How to add or fix a term
```

Each term looks like this:

```json
{
  "slug": "rag",
  "term": "RAG",
  "acronym": "Retrieval-Augmented Generation",
  "category": "Patterns",
  "short": "Fetching relevant documents at query time and feeding them to the model as context.",
  "definition": "Retrieval-Augmented Generation grounds a model's answer in external knowledge ...",
  "example": null,
  "related": ["embedding", "vector-database", "context-window"]
}
```

## Want to add a term?

Two ways, both welcome:

- **Suggest one in 30 seconds** — [open a "Suggest a term" issue](../../issues/new?template=suggest-a-term.yml) and fill in the form. No coding required.
- **Add it yourself** — read [CONTRIBUTING.md](CONTRIBUTING.md), add a file under `terms/`, and open a pull request.

A GitHub Action checks every contribution against `schema.json` automatically, so you'll know right away if anything needs fixing.

## License

The dictionary data is licensed under [CC BY 4.0](LICENSE) — free to use and share with attribution.
