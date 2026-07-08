# Software Requirements Specification (SRS) – JustSow MVP

**Version:** Draft 0.2
**Date:** 2026-07-07

## 1. Introduction

### 1.1 Purpose

This document defines the current functional and non-functional requirements for the JustSow MVP.

### 1.2 Scope

The MVP will:

- allow project owners to create and submit structured project applications with images and a one-minute video
- allow gatekeepers to approve, reject, request revision, publish, archive, and curate case studies
- allow project owners to propose edits to existing projects, with all edits requiring gatekeeper approval before going live
- allow sowers to have accounts and view their seed history
- allow staff to create manual sower records that a sower can later claim as an account
- allow seed allocators to link a single seed to a single project
- include email-based account flows and two-factor authentication
- include branded HTML email notifications for account and project workflow events

Broader internal operations remain in Notion and are out of scope for the website unless a website-native workflow is required.

## 2. Glossary Of Key Terms

- **Project owner**: A user who submits and manages their own project applications.
- **Sower**: An individual or organisation associated with a seed and able to view their own seed history if they have or claim an account.
- **Seed**: A funding record associated with one project in the MVP.
- **Project**: A proposal submitted by a project owner seeking support.
- **Gatekeeper**: A user role with authority to control project approvals, revisions, status, visibility, and case study selection.
- **Stewardship staff**: Users who can view records and support stewardship processes.
- **Seed allocator**: A user role responsible for creating sower records and assigning a seed to a project.
- **Admin**: A user role responsible for user, security, and platform administration.
- **Case study**: A completed project curated for public display.

## 3. Users And Roles

| Role | Responsibilities | Access |
| --- | --- | --- |
| Project owner | Submit projects, revise applications, propose edits to existing projects | Own projects and related workflow only |
| Sower | View own seed history, claim or manage own account | Own seed history only |
| Gatekeeper | Approve, reject, revise, publish, archive, mark case studies | All relevant project workflow records |
| Seed allocator | Create manual sower records, assign a seed to a project | Sower and seed allocation workflows |
| Stewardship staff | View project and seed records, support stewardship process | Read-oriented access across relevant records |
| Admin | Manage users, roles, and security-sensitive settings | Full administrative access |

Users may hold multiple roles at once.

## 4. System Environment

- web-based application
- desktop and mobile responsive
- English first
- broader ops processes continue in Notion

## 5. Functional Requirements

### 5.1 Project Applications

- **FR-1**: Project owners can create project applications with structured fields.
- **FR-2**: Projects can include up to 10 images and 1 one-minute portrait video.
- **FR-3**: Drafts can be saved and edited before submission.
- **FR-4**: Submitted projects enter a review workflow and are not directly editable as live content.
- **FR-5**: Gatekeepers can request revisions with feedback. Project owners can revise and resubmit.
- **FR-6**: Gatekeepers approve workflow decisions; they should not rely on silent direct editing of owner content as the normal workflow.

### 5.2 Project Lifecycle And Publishing

- **FR-7**: The system supports statuses covering draft, review, revision, approval, publication, sown state, completion, and archival.
- **FR-8**: Only gatekeepers can approve project status or visibility changes.
- **FR-9**: Published projects are public. Non-public and archived non-case-study projects are internal only.
- **FR-10**: Completed projects can be marked as case studies for public display.

### 5.3 Project Change Approval

- **FR-11**: Project owners can propose edits to their own projects after initial approval.
- **FR-12**: Proposed edits must be reviewed by gatekeepers before they affect the live project.
- **FR-13**: The system records approval outcomes and revision feedback for submitted edits.

### 5.4 Seeds And Sowers

- **FR-14**: For MVP, each project can have at most one seed.
- **FR-15**: A project is either unsown or sown.
- **FR-16**: Seed allocation is performed by seed allocators.
- **FR-17**: The system tracks seed history, project association, sower identity, and allocation date.
- **FR-18**: Staff can create sower records without requiring immediate self-service registration.
- **FR-19**: A sower can later claim a manually created record and access their history.

### 5.5 Accounts, Identity, And Security

- **FR-20**: Users can create and manage accounts where permitted by role and workflow.
- **FR-21**: The system supports email verification, password reset, and account email update flows.
- **FR-22**: The system supports two-factor authentication.
- **FR-23**: Users may hold multiple roles.

### 5.6 Notifications

- **FR-24**: Branded HTML email notifications are sent for account lifecycle events.
- **FR-25**: Branded HTML email notifications are sent for project approval, rejection, and revision events.
- **FR-26**: Notifications include direct links into the relevant area of the system where appropriate.

### 5.7 Media

- **FR-27**: The platform stores and presents project images and a one-minute video.
- **FR-28**: The platform may generate or store thumbnails or previews where needed for usable UX.

## 6. Non-Functional Requirements

### 6.1 Security

- role-based access control
- support for multi-role users
- private sower contact information
- audit trail for approvals, account claims, and role changes

### 6.2 Usability

- responsive design for desktop and mobile
- clear separation between owner, sower, and employee workflows
- draft saving for applications

### 6.3 Performance

- suitable performance for the MVP usage profile
- draft saving should feel near real-time

### 6.4 Maintainability

- modular structure for auth, projects, approvals, sowers, and seeds
- ability to evolve toward payments and broader regional support

### 6.5 Legal And Compliance

- support for privacy and data handling obligations relevant to launch regions
- full audit trail for project states, seeds, approvals, case study selections, and sensitive account actions

## 7. Out Of Scope

- replacing the broader Notion-based operational workflow
- advanced analytics beyond basic product needs
- immediate multi-language support
- architecture optimized for global multi-region scale from day one
