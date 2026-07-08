# 0005: Sign-In And Two-Factor Flow

## Status

Proposed

## Decision

JustSow sign-in should use:

- email and password as the primary authentication method for MVP
- Better Auth session management
- TOTP authenticator app as the primary second factor
- backup codes for recovery from lost authenticator access
- optional trusted-device support to reduce repeated prompts on the same device

The intended sign-in sequence is:

1. user signs in with email and password
2. if two-factor is enabled, the user is redirected to a second-factor challenge
3. the user enters a TOTP code or backup code
4. the session becomes fully authenticated

2FA should be:

- strongly recommended for sowers and project owners
- required for privileged roles such as admins and gatekeepers
- likely required for seed allocators as well, subject to final approval

## Why

- TOTP provides a strong second factor without adding SMS delivery risk or cost
- backup codes provide a practical recovery path for MVP
- trusted-device support improves usability for repeat logins
- privileged roles handle approvals, publishing, and access-sensitive actions, so they need stronger account protection

## Constraints

- the sign-in UX must stay understandable for non-technical users
- account recovery must not depend solely on the authenticator device
- the backend and UI should treat second-factor completion as a distinct step after password authentication
