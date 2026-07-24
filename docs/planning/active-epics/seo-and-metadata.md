# SEO And Metadata

## Objective

Define and implement a consistent SEO and metadata pattern for the public site, then clean up any page-level remnants left from earlier experiments.

## Scope

- page title format
- meta description format
- canonical link handling
- Open Graph and Twitter card fields for public pages
- robots directives for public, auth, and account areas
- route-level metadata conventions in the SvelteKit app

## Non-Goals

- marketing copy rewrites
- search engine marketing or analytics setup
- schema for every possible content type on day one

## Conventions

- public pages should set a unique, descriptive `title`
- public pages should set a concise `description`
- public pages should set canonical and social preview metadata when they are launch-ready
- auth and account pages should avoid being indexed unless explicitly needed
- any page-specific metadata should live with the route unless it is shared across a section

## Acceptance Criteria

- future sessions have a single place to check SEO and metadata expectations
- public pages follow a consistent title/description/social-preview format
- leftover metadata experiments are removed or normalized

## Status

Planned
