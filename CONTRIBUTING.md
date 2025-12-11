Contributing
============

Thanks for helping improve `coss-mcp`! This project is a simple MCP stdio server for coss.com and Coss UI docs.

Dev workflow
------------
- Install: `npm install`
- Type-check/build: `npm run build`
- Tests: `npm test`
- Dev server: `npm run dev` (waits on stdio for the host)

Logging
-------
For stdio MCP servers, stdout must be reserved for JSON-RPC. Keep logs on stderr (`console.error`) or files.

Coding standards
----------------
- TypeScript, strict mode enabled.
- Prefer small, focused PRs with clear descriptions.
- Include tests when adding or changing parsing/extraction logic.

Before opening a PR
-------------------
- Run `npm run build`
- Run `npm test`
- Confirm README/config snippets still match the code paths.

Issue reporting
---------------
- Include reproduction steps, expected vs. actual behavior, and host/version info if relevant.

