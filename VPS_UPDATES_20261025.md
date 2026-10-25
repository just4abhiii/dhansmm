# VPS updates — 25 October 2026

This commit records the selected latest live VPS files, not a new deployment.
No environment files, credentials, wallet data, customer data, database dumps, or backups are included. Existing repository files and history are preserved.

## Dhansmm
This repository and VPS contain compiled frontend assets, not editable frontend source. The versioned JavaScript referenced by `frontend/index.html` is the actual latest deployed bundle. The previous asset remains for rollback.

- Custom bundle names/icons and provider-aware comments.
- Separate Custom Comments option.
- Views 1000, Likes 25, Comments 1, Saves 12, Shares 13, Reposts 11 by default; new versioned saved settings remain supported.
- Reach/Impressions default ratio 50%.

Run `node --test tests/vps/*.test.cjs`. Apply the idempotent metadata SQL only if the target database lacks these columns. No backend files, provider credentials, or customer data were changed or exported.
