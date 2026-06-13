# Semaglutide-HFpEF-LivingMeta

Browser-native living meta-analysis of semaglutide in HFpEF with obesity.

The dashboard ([`SEMAGLUTIDE_HFPEF_REVIEW.html`](SEMAGLUTIDE_HFPEF_REVIEW.html))
ingests the RCTs cross-checked against ClinicalTrials.gov, PubMed and OpenAlex,
then pools them in-browser with random-effects meta-analysis: REML τ²
(DerSimonian-Laird as a sensitivity sidecar), Hartung-Knapp-Sidik-Jonkman CI
adjustment with a `max(1, Q/(k-1))` floor, Q-profile τ² confidence interval, and
a `t_{k-1}` prediction interval (Cochrane Handbook v6.5). All computation runs
client-side with no server; the page is fully offline-capable and served via
GitHub Pages. `index.html` redirects to the dashboard.

## Tests

```
npm test    # node tests/smoke.test.js — offline asset-integrity smoke checks
```

The smoke test verifies the shipped HTML has no BOM, no unfilled template
tokens, no hardcoded local paths, balanced `<script>` tags, and that the core
statistical-engine symbols are present.

See [`E156-PROTOCOL.md`](E156-PROTOCOL.md) for the estimands, dataset
identifiers, and submission metadata.

_Status: Submission ready (portfolio registry)._
