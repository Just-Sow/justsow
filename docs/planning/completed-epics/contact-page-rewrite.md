# Contact Page Rewrite

## Objective

Redesign and implement the public contact page so it has a clear user experience and a functioning contact workflow.

## Scope

- contact page information architecture
- updated visual design and layout
- cleanup icon libraries and standardize the contact page icon set
- working contact form flow
- validation, success, and failure states
- integration with the chosen delivery or notification path

## Non-Goals

- building a full support desk or CRM
- broad marketing-site redesign outside the contact page

## Dependencies

- confirmed submission handling approach
- spam prevention approach appropriate for MVP
- final brand and content direction for contact copy

## Acceptance Criteria

- the contact page has a clear and intentional UI
- users can submit an enquiry successfully from the site
- validation and submission outcomes are clearly communicated
- the implementation is consistent with the broader site quality bar

## Status

Complete

## Progress

Completed:

- public contact page rebuilt around the original two-column layout with shadcn components
- contact form now validates name, email, and message before submission
- client-side submission now posts to `/api/contact` and surfaces success and failure states
- API route now accepts contact submissions, applies basic spam throttling, and stores entries in a local contact outbox
- contact page and API route both have automated coverage
