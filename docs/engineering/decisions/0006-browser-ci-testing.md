# 0006 Browser CI Testing

Status: Proposed

## Decision
Keep the web app's browser coverage on Vitest with the Playwright provider, and run it headless in CI after installing Chromium.

## Why
This preserves the current component-level browser tests while making the suite suitable for automated CI runs.

## Constraints
- Browser tests still require a real browser runtime and Vitest's browser API server.
- CI must install Chromium before running the web test suite.
- Local headless runs should use the same project configuration as CI.
