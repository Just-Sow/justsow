# 0008: Country-Scoped Project Visibility

## Status

Accepted

## Decision

JustSow should scope project discovery and presentation by country market while keeping published projects public on the web.

Users should primarily see projects for their local market, based on browser location or explicit market selection, and project funding amounts should be displayed in that market's localized currency format.

## Why

- the product is expected to operate with country-specific project catalogs rather than one global public listing
- market-local discovery allows simpler pricing and donation presentation for each launch market
- currency display can rely on the viewer's market context instead of showing explicit cross-market currency prefixes everywhere

## Constraints

- published projects remain public, but default discovery should favor the viewer's active market
- public and authenticated project discovery should use the same market-selection rules
- localized currency display must follow the active market shown to the user
