# 0009: Static Page Content Management

## Status

Proposed

## Decision

Use Sanity as the editorial CMS for static public-site pages, related marketing media, and header/footer public-content navigation. Pages are composed from a finite set of reusable, typed sections. Initial editor-created pages use single-segment paths. Keep page rendering and interactive behavior in the SvelteKit app. Keep projects, submissions, approvals, publishing state, users, and other operational records owned by the app/API.

## Why

- static marketing content needs an editorial workflow without turning the product app into an internal content-management system
- project content participates in moderation and audit workflows that must remain app-controlled

## Constraints

- scope the first delivery to explicitly agreed public static pages and fields
- do not move forms, account flows, project discovery data, or workflow state into Sanity
- keep authentication, account, basket, and other functional header controls in the app, separate from CMS-managed public navigation links
- expose only approved section types and presentation options to editors; do not allow arbitrary layouts or styles
- keep the Studio standalone within the monorepo unless deployment constraints justify another shape
- allow draft reads only through an authorized editor preview session; public visitors receive published content only
- do not silently mask a missing page or CMS outage with hard-coded content
