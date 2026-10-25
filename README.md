# Dhansmm

**A VPS-deployed panel for provider-linked engagement bundles, customer orders, and configurable delivery.**

[Website](https://dhansmm.site) · [Repository](https://github.com/just4abhiii/dhansmm) · [Latest updates](VPS_UPDATES_20261025.md)

## Overview

Dhansmm contains deployment files for a social-media service ordering panel. Customers select configured services, adjust bundle quantities, and use delivery controls. Administrators manage linked providers and bundle configuration.

Gradual or randomized delivery is a scheduling feature. It does not prove authentic or human-generated engagement, establish platform approval, or guarantee performance. Provider quality and permissible use require independent review.

## Current features

- Custom bundle service names and uploaded icons.
- Separate Comments, Custom Comments, and general Custom options.
- Line-by-line comment entry only when the linked provider supports custom comments.
- Normal, random, emoji, and unlinked providers do not request custom-comment text.
- Provider-linked quantity limits rather than invented minimums.
- Customer-adjustable quantities and versioned saved preferences.
- Custom delivery scheduling within the existing bundle workflow.

## First-visit defaults

| Engagement | Quantity |
|---|---:|
| Views | 1,000 |
| Likes | 25 |
| Comments | 1 |
| Shares | 13 |
| Reposts | 11 |
| Saves | 12 |

The separate Custom Comments option defaults to 1 when present. Reach/Impressions uses a default ratio of 50%, equivalent to 500 at 1,000 base views. Provider limits and explicitly saved current preferences still apply. Organic SMM's off-by-default Reach/Impressions interface should not be assumed to exist here.

## Repository format

**This repository contains compiled deployment artifacts, not an editable frontend source project.** Do not assume the original frontend source or a frontend development server is included.

| Path | Purpose |
|---|---|
| `frontend/` | Deployed HTML and compiled assets |
| `backend/` | Backend deployment artifacts |
| `database/migrations/` | Schema changes included with recent updates |
| `tests/vps/` | Standalone comment/custom-service checks |
| `VPS_DEPLOY_GUIDE.md` | Existing VPS setup guide |
| `VPS_UPDATES_20261025.md` | Latest selected changes and limitations |

The recorded frontend entry is `frontend/index.html`, referencing the versioned `index-dhan-defaults-20261026.js` asset. Earlier assets remain for controlled rollback. Dhansmm and Organic SMM are separate deployments; do not mix their databases, assets, or credentials.

## Checks

With a compatible Node.js installation:

```sh
node --check frontend/assets/index-dhan-defaults-20261026.js
node --test tests/vps/*.test.cjs
```

These checks cover selected rules and JavaScript syntax. They do not certify complete application behavior, production security, or successful paid provider delivery.

## Deployment precautions

Read the [existing VPS guide](VPS_DEPLOY_GUIDE.md) and [latest notes](VPS_UPDATES_20261025.md). Reconcile paths with your actual host before executing commands: older guide steps may describe the original installation package rather than the current repository layout.

1. Back up targeted files and affected databases before changing anything.
2. Keep credentials in protected server configuration or a secret manager, outside version control.
3. Review migrations before applying them. The recent metadata SQL adds nullable label/icon fields without exporting customer or provider records.
4. Deploy matching HTML and its versioned asset together; retain the rollback asset.
5. Verify asset loading, provider switching, quantities, pricing, and authenticated workflows in an isolated test environment.

A GitHub update is not an automatic VPS rollout. Database changes, server processes, and frontend deployment need separate verification.

## Security and privacy

- Never commit tokens, passwords, session secrets, private keys, or secret-bearing environment files.
- Do not publish customer exports, database dumps, balances, payment evidence, or support conversations.
- Keep privileged server credentials out of frontend assets. Minified code is not a security boundary.
- Review authentication, administrator permissions, input validation, and dependencies before release.
- Revoke/rotate exposed credentials and review repository history. Removing the latest copy does not remove earlier versions.

Report sensitive issues privately through a contact published by the repository owner. Do not include credentials or personal information in public issues. This README does not establish a monitored security mailbox or guaranteed response time.

## Responsible use

Follow GitHub's [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies), applicable law, provider agreements, and relevant social-platform rules. Do not use the software for spam, harassment, impersonation, unauthorized access, or misleading claims about engagement authenticity. Do not use purchased or automated engagement where the target platform prohibits it.

Documentation cannot make prohibited conduct permissible. This README is not a compliance certificate and cannot guarantee protection from GitHub restrictions or suspension.

## Maintenance and licensing

Keep updates site-specific and include regression checks. Public repository visibility alone does not grant redistribution rights; verify licensing with the owner. No new license is granted by this README.