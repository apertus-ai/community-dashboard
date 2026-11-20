# Apertus Impact Tracker

_Live, self-serve impact metrics for the Apertus models — the numbers behind our slides, flyers and news posts, gathered automatically from public APIs._

Apertus reports its impact to academic and industry partners through presentation slides, flyers and the [online news area](https://apertus-ai.org). Collecting those numbers by hand is slow to do and stale by the time it's needed. This project is the tool for doing it easily instead: one dashboard that pulls adoption and community-impact data for the Apertus model family (plus peer models for honest comparison) straight from the public Hugging Face and GitHub APIs.

It runs with **zero configuration** and shows **live public data only** — nothing simulated, nothing cached.

## Why this exists

- Partners need a **clear, comprehensive, regular** overview of Apertus impact.
- The same headline numbers are reused across slides, flyers and news posts — one source of truth keeps them consistent.
- Manual collection doesn't scale and can't be reproduced after the fact.
- The collection logic in this repo is exactly what a **CI job or API** can run later (see [Roadmap](#roadmap)).

## Quick start

```bash
npm install
npm run dev
```

Then open the printed URL. Two **optional** tokens (put them in `.env`, see `.env.example` for the template) lift API rate limits but never gate data:

| Token | Get it here | Effect |
| --- | --- | --- |
| `VITE_HF_TOKEN` | [Hugging Face Access Tokens](https://huggingface.co/settings/tokens) (fine-grained, read-public is enough) | Lifts Hugging Face rate limits |
| `VITE_GITHUB_TOKEN` | [GitHub fine-grained PAT](https://github.com/settings/personal-access-tokens) (no extra scopes) | GitHub: 60 → 5,000 req/hour |

## What it tracks

| Panel | The question it answers for partners | Source |
| --- | --- | --- |
| **Downloads & peer comparison** | How much are the Apertus models downloaded, next to comparable projects? | Hugging Face Hub API |
| **Ecosystem** | What has the community built on top — finetunes, adapters, quantizations, merges, Spaces, datasets? | Hugging Face Hub API |
| **Contributions** | Who is doing the work, and how much comes from outside the core team? | GitHub REST API |
| **Community health** | Do people get answers? Resolution rate, median first response, unanswered threads | Hugging Face discussions API |

### Copy a report

The **Copy summary** button in the header puts a paste-ready Markdown report of the current numbers on your clipboard: the selected model's headline stats, the peer-comparison table, the GitHub external-contribution share, top org datasets and community health — each report stamped with its generation time. That block is what goes into a slide note, flyer draft or news post, so every channel quotes the same figures.

### Updating the tracked models and repos

Everything tracked lives in [`src/config.js`](src/config.js) — no other code changes needed:

- `MODELS` — model ids on the Hugging Face Hub. The first entry is a deliberate blank sentinel that keeps the header's model selector unselected on start; leave it in place.
- `TRACKED_REPOS` — `swiss-ai` repositories surfaced in the Contributions panel.
- `GITHUB_ORG` / `HF_ORG` — the orgs all queries run against.

## Roadmap

The dashboard already replaces the manual collection step. Next steps, in rough order:

1. **CI snapshots** — a scheduled GitHub Action that runs the same collection and commits a dated JSON snapshot, so trends are archived and slides can cite historical numbers.
2. **JSON export** — serve the summary as static JSON so the news area and other tools can embed the numbers directly.
3. **Automated refresh** — CI-generated figures feeding the site automatically, with this dashboard as the human-readable view.

## Origin

Originally built with [OpenHands](https://openhands.dev) and the [GLM-5](https://glm5.net) model, then reshaped into the Apertus Impact Tracker.
