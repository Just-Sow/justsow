# Infrastructure Direction

## Current Position

Infrastructure analysis and cost analysis will need a future refresh. They are useful background, but they are not the current priority.

## Working Assumption

For MVP and early production, the working assumption is:

- application hosting on EC2
- relational database on RDS

This is based on the earlier conclusion that EC2 + RDS is the cheapest and most predictable early-stage option.

## What Is Deferred

- refreshed cost modeling
- refreshed hosting comparison
- advanced multi-region architecture
- serverless migration decisions

## Revisit Triggers

Re-evaluate infrastructure when one or more of these become true:

- global traffic patterns make latency a significant problem
- operational load makes self-managed infrastructure unattractive
- payment flows or media delivery requirements materially change system load
- uptime and failover requirements exceed a simple early-stage setup
