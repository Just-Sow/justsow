# UI MVP Funding Interactions

## Objective

Make the public project discovery experience feel interactive enough to demonstrate
the donor journey before backend funding functionality is available.

## Scope

- fund-now right-side sheet with project context and whole-$1,000 increment options
- centered project views for Featured, Almost Done, Fresh Ideas, and Map
- community preview showing other sowers connected to each project
- ephemeral Seedbed basket with an ecommerce-style summary
- browser-only state persistence for the current tab/session
- interactive MapLibre project map with custom image pins and anchored project popups

## Non-Goals

- payment processing or checkout
- authenticated seed allocation
- backend project, sower, or seed records
- durable cart state or cross-device synchronization

## Demo Rules

- a project can appear only once in the Seedbed
- adding the same project again updates its selected amount
- the maximum selectable amount is the highest whole-thousand amount that does not exceed the project’s remaining funding amount
- Seedbed state is stored in `sessionStorage` and is safe to discard

## Current Demo Notes

- the Fund Now sheet mirrors project-card milestones and previews the selected seed as a secondary funding segment
- the next milestone amount is selected by default and marked with a secondary treatment and flame icon
- Map uses the keyless OpenFreeMap Positron style, with project pins positioned at the demo project locations
- map pins use project images, stay anchored to their coordinates during map movement, and show the secondary near-goal marker only when relevant
- clicking a map pin opens one anchored project popup; Fund Now is active and project details remain disabled until a project route exists
- “Review Seeds” currently closes the Seedbed summary only; checkout and allocation are not implemented

## Acceptance Criteria

- visitors can open Fund Now from a project card and choose a seed amount
- visitors can switch between Featured, funding-progress, and completion filters
- visitors can add projects to Seedbed and review project names, amounts, and total
- visitors can remove entries or clear the demo Seedbed
- no interaction implies that a real payment or allocation has occurred

## Status

In Progress
