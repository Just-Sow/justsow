# Deferred Infrastructure Notes

## Purpose

This file preserves the current high-level conclusion from earlier hosting and cost analysis without keeping those older documents as active top-level guidance.

## Current Working Conclusion

- EC2 + RDS is the assumed early production direction
- the main reason is lower and more predictable cost for MVP-stage usage
- a more distributed or serverless architecture may make sense later if traffic, geography, or operational needs justify it

## Deferred Work

These topics should be revisited later rather than treated as current design constraints now:

- refreshed hosting comparison
- refreshed cost analysis
- advanced usage projections
- global distribution and CDN strategy beyond a pragmatic MVP setup
