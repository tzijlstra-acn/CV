# Publication risk audit

Date: 2026-11-02. Scope: the seven repositories the previous portfolio linked, two candidates for the Work Fabric case, and this repository. Method and per-repository status: see `PUBLICATION_AUDIT.md`. The detailed findings (paths, lines, branches and private specifics) are kept in a gitignored file under `private/audit/`.

## Method

1. Fresh mirror clones of every repository from GitHub, so the audit covers what is actually public: all branches, all commits, deleted files and commit messages.
2. Searches for organisation names (clients, prospects, employers, regulators as context), personal data, credentials and secrets, infrastructure identifiers, and production or contribution claims.
3. A sample of committed images opened and checked, plus README, licence and Pages output.
4. No scripts from the audited repositories were run, and nothing in them was changed.

## Summary

| Area | Finding | Effect on the portfolio |
|---|---|---|
| Secrets | None found in any commit. | None. |
| Client-identifying content | Present in one public repository and referenced once in another. | Those repositories are not linked. The case text was rewritten from verified facts, with client context excluded. |
| Employer provenance | Several repositories began as employer-branded practice assets. | All public-build evidence awaits Thomas's confirmation; no repository is described as independent work. |
| Personal data | Third-party personal data in one candidate repository; personal content in another. | Neither is linked; one archive item is withheld. |
| Empty repository | One linked repository has no commits. | Its evidence is withheld. |
| Claims in READMEs | Several READMEs claim production quality or a client audience. | The portfolio states the implemented and reference parts of each prototype instead. |
| This repository | The previous public target mode was in tracked files and in history. | Removed from tracked files; history is unchanged (already public). |

## Portfolio-wide recommendations

- Use a GitHub no-reply address for future commits, so commit metadata does not carry the employer domain.
- Make the private repositories private before the new portfolio is published, so no link from earlier CV versions leads to them.
- Keep the gitignored `private/` folder out of every archive and upload. `npm run release` packages tracked files only.

## Statuses used

`approved and linked`, `approved after cleanup`, `public but unlinked`, `private`, `archived`, `blocked pending Thomas decision`. A recommendation is never a decision: only Thomas approves a link.
