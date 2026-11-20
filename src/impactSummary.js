// Builds the paste-ready Markdown impact summary behind the header's
// "Copy summary" button. Input is the already-fetched live state — no new
// requests are made. Missing sources render as an explicit "unavailable"
// line rather than being dropped, so a pasted report never silently omits
// data that slides or news posts might want to quote.

import { OPENNESS_LABELS } from './config'
import { formatCompact, formatDuration } from './utils'

const DASH = '—'

const fmt = (value) => (value == null ? DASH : Number(value).toLocaleString())

function derivedTotal(model) {
  const counts = model.childrenModelCount
  if (!counts) return null
  return Object.values(counts).reduce((sum, n) => sum + n, 0)
}

export function buildImpactSummary({
  models,
  selectedInfo,
  selectedModelName,
  pulse,
  health,
  datasets,
  repos,
  generatedAt,
}) {
  const lines = []

  lines.push('# Apertus impact summary')
  lines.push('')
  lines.push(
    `_Generated ${generatedAt.toLocaleString()} · live from the public Hugging Face and GitHub APIs_`
  )
  lines.push('')

  // Selected model — the headline stats quoted most often.
  if (selectedInfo) {
    lines.push(`## ${selectedModelName ?? selectedInfo.id}`)
    lines.push('')
    lines.push(`- Downloads (30 days): **${fmt(selectedInfo.downloads)}**`)
    lines.push(`- Downloads (all time): **${fmt(selectedInfo.downloadsAllTime)}**`)
    lines.push(`- Likes: **${fmt(selectedInfo.likes)}**`)
    lines.push(
      `- Derived works (finetunes, adapters, quantizations, merges): **${fmt(derivedTotal(selectedInfo))}**`
    )
    lines.push(`- Spaces building on it: **${fmt(selectedInfo.spaces?.length ?? 0)}**`)
    lines.push('')
  }

  // Peer comparison, grouped the same way the dashboard groups it.
  const tracked = (models ?? []).filter((m) => m.id)
  if (tracked.length) {
    lines.push('## Peer comparison — downloads, last 30 days')
    lines.push('')
    lines.push('| Model | Downloads (30d) | All time | Likes | Derived works |')
    lines.push('| --- | ---: | ---: | ---: | ---: |')
    for (const group of [...new Set(tracked.map((m) => m.openness))]) {
      const label = OPENNESS_LABELS[group] ?? group
      lines.push(`| **${label}** | | | | |`)
      for (const model of tracked.filter((m) => m.openness === group)) {
        const derived = derivedTotal(model)
        lines.push(
          `| ${model.name} | ${fmt(model.downloads)} | ${formatCompact(model.downloadsAllTime)} | ${formatCompact(model.likes)} | ${derived == null ? DASH : fmt(derived)} |`
        )
      }
    }
    lines.push('')
  }

  // GitHub contributions.
  lines.push('## GitHub contributions (swiss-ai org)')
  lines.push('')
  if (pulse) {
    lines.push(
      `- External PR share: **${Math.round(pulse.externalPRShare * 100)}%** of ${fmt(pulse.totalMerged)} merged PRs`
    )
    const topRepos = (repos ?? [])
      .filter((repo) => repo.tracked)
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 5)
    if (topRepos.length) {
      lines.push('')
      lines.push('| Repository | Stars | Forks |')
      lines.push('| --- | ---: | ---: |')
      for (const repo of topRepos) {
        lines.push(
          `| [${repo.name}](${repo.url}) | ${repo.stars.toLocaleString()} | ${repo.forks.toLocaleString()} |`
        )
      }
    }
  } else {
    lines.push('_Unavailable right now — the GitHub API request failed or was rate-limited._')
  }
  lines.push('')

  // Org datasets.
  if (datasets?.length) {
    lines.push('## Top org datasets')
    lines.push('')
    lines.push('| Dataset | Downloads | Likes |')
    lines.push('| --- | ---: | ---: |')
    for (const dataset of datasets.slice(0, 5)) {
      lines.push(
        `| [${dataset.id.split('/').pop()}](${dataset.url}) | ${formatCompact(dataset.downloads)} | ${formatCompact(dataset.likes)} |`
      )
    }
    lines.push('')
  }

  // Community health for the selected model.
  if (health) {
    lines.push(`## Community health${selectedModelName ? ` — ${selectedModelName}` : ''}`)
    lines.push('')
    lines.push(
      `- Resolution rate: **${health.resolutionRate == null ? DASH : `${Math.round(health.resolutionRate * 100)}%`}**`
    )
    lines.push(`- Median first response: **${formatDuration(health.medianFirstResponseMs)}**`)
    lines.push(`- Open discussions without a reply: **${fmt(health.unansweredCount)}**`)
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push('Nothing here is simulated — regenerate any time from the Apertus Impact Tracker.')

  return lines.join('\n')
}
