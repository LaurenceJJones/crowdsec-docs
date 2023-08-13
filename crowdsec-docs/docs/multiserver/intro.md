---
id: intro
title: Multi-Server setup
---

Security Engine [architecture](/docs/intro#architecture) allows for distributed setups, as the core components communicate via [HTTP API](/docs/local_api/intro).

When setting up a multi-server setup, you need to understand the role of each component, and how they communicate with each other:
- Log Processor (Security engine with LAPI disabled)
  - [Parsers logs locally](/docs/parsers/intro)
  - Matches them against [scenarios](/docs/scenarios/intro)
  - Sends the resulting alerts to the [local API](/docs/local_api/intro)
- Security Engine (Log processor with LAPI enabled) Will be known as "main lapi" moving forward 
  - Receives the alerts and converts them into decisions based on your profile
  - Sends notifications based on the matching profiles if any
  - Communicates to CAPI to receive community blocklists and sends local alerts
- Remediation Components
  - Queries the LAPI to receive the decisions

A typical multi server setup should thus have:

- Multiple log processors, each one in charge of processing the logs of a given server/application
- A single security engine, in charge of receiving the alerts from the log processors, and converting them into decisions
  - If you wish to have a high availability setup, you can have multiple security engines, and use a load balancer to distribute the alerts to them (However, the security engines have to be configured to same underlying database as by default it uses SQLite)

You can expand the dropdown menu to the left to see dedicated guides for each setup type:

- Main LAPI
  - Bare metal
  - Container (Docker/Podman)
- Log Processors
  - Bare metal
  - Container (Docker/Podman)
  