# Product Scope

## Product Summary

JustSow is a web platform for:

- project owners submitting and managing projects
- gatekeepers and staff reviewing, approving, and publishing those projects
- sowers creating accounts, viewing their own giving history, and participating in the funding story of the platform

The MVP focuses on workflow control, role-based access, and a strong approval model. Broader operational processes remain in Notion.

## MVP Users

- Project owners
- Sowers
- Gatekeepers
- Seed allocators
- Stewardship staff
- Admins

Users may hold multiple roles at the same time.

## Core MVP Capabilities

### Project owners

- create and save draft applications
- submit applications for review
- receive revision requests from gatekeepers
- propose edits to their own project content after approval
- view the status and history of their own projects

All project-owner changes after submission require gatekeeper approval before they become live.

### Sowers

- create accounts
- sign in securely
- view their own seed history
- be linked to existing manually created sower records

For MVP, a sower may also exist without a self-created account. Staff can create a sower record manually and the sower can later take control of that record by setting a password through email-based account claiming.

### Employees

- review submissions
- approve, reject, or request revisions
- approve or reject owner-submitted edits to existing projects
- control publish state and visibility
- allocate a seed to a project
- manage users, roles, and platform oversight

## MVP Simplifications

- one seed per project
- a project is either unsown or sown
- broader internal operations continue in Notion
- advanced region expansion is deferred

## Near-Term Post-MVP Direction

- on-site donor payments
- richer donor account capabilities
- broader project owner self-service
- more mature regional support if operationally required

## Non-Goals

- replacing the full internal operational workflow already handled in Notion
- building a broad internal business dashboard unless a website-native need appears
- optimizing immediately for multi-region serverless deployment

## Architecture Implications

- role-based access control must support multiple roles per user
- audit history is a first-class concern
- account claiming and identity linking are core requirements
- project content changes need a moderation workflow, not direct publishing
- payment support should be designed as a future domain even if not fully implemented on day one
