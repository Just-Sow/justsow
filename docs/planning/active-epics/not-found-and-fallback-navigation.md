# Not Found And Fallback Navigation

## Objective

Add a branded 404 experience and define how unfinished or missing public routes should degrade safely.

## Scope

- custom 404 page design and copy
- missing-route handling in the SvelteKit app
- fallback treatment for placeholder or unpublished public links
- internal guidance for when to render disabled copy instead of dead links

## Non-Goals

- full public-site navigation redesign
- search or site map features

## Dependencies

- agreed public site information architecture
- final list of placeholder versus launch-ready public routes

## Open Questions

- whether placeholder project pages should route to 404 or stay visibly disabled until launch
- whether the 404 page should surface featured links, search, or contact actions

## Acceptance Criteria

- unknown public routes show a branded not-found page
- unfinished public links no longer behave like broken navigation
- placeholder states are visually intentional and consistent

## Status

Planned
