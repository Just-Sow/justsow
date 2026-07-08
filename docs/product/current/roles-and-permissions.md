# Roles And Permissions

## Core Rule

Users may hold multiple roles at the same time. Permissions should be additive unless a stricter policy explicitly limits an action.

## Roles

### Project owner

- create draft projects
- submit projects for review
- respond to revision requests
- propose edits to their own existing projects
- view their own project history and approval outcomes

Project owners cannot publish their own changes directly.

### Sower

- sign in to an account
- view their own seed history
- claim a manually created sower record through email-based account setup

### Gatekeeper

- approve, reject, or request revisions for submitted projects
- approve, reject, or request revisions for post-approval project edits
- control project status, visibility, and publishing
- mark completed projects as case studies

Gatekeepers should not silently rewrite project-owner content. Material changes should flow through explicit approval decisions.

### Seed allocator

- create manual sower records
- link a seed to a project
- mark a project as sown
- maintain seed allocation records

### Stewardship staff

- view project and seed records
- view archived items
- support review and stewardship processes

### Admin

- manage users
- assign roles
- manage security-sensitive platform settings
- oversee compliance and access policies

## Permission Design Implications

- authorization should be role-based, not based on a single account type
- data models should support many-to-many user-role assignment
- UI navigation should be capability-driven so one user can access multiple work areas safely
