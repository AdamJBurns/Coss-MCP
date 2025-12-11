coss-mcp
========

MCP stdio server exposing tools for coss.com pages and Coss UI docs.

Quick start
-----------
- Install deps: `npm install`
- Dev (stdio, waits for host): `npm run dev`
- Build: `npm run build`
- Prod: `npm start`
- Tests: `npm test`

Host config (stdio)
-------------------
Add under `mcpServers` (update `cwd` to your absolute repo path):
```json
"coss-mcp": {
  "type": "stdio",
  "command": "npm",
  "args": ["run", "dev"],
  "cwd": "C:/path/to/your/coss-mcp"
}
```

If your host cannot set `cwd` (Windows example):
```json
"coss-mcp": {
  "type": "stdio",
  "command": "cmd",
  "args": ["/c", "cd /d C:\\path\\to\\your\\coss-mcp && npm run dev"]
}
```

After build, you can run directly:
- `node dist/server.js`

Tools
-----
- `ping` — health check, echoes `pong`.
- `fetch_coss_page` — fetches `https://coss.com/<path>`, extracts page title and readable text (scripts/styles removed, whitespace collapsed, truncated to ~8k chars).
- `list_coss_ui_docs` — lists the Coss UI docs from `https://coss.com/ui/llms.txt`.
- `fetch_coss_ui_doc` — fetches a specific Coss UI doc. Pass a relative path like `components/button.md` or a full URL from the listing.

Development notes
-----------------
- Logging: for stdio transports, writing to stdout breaks JSON-RPC; startup messages are sent to stderr via `console.error`.
- Tests: `npm test` runs html extraction and Coss UI listing parsers.
- Type checking/build: `npm run build`.

Contributing
------------
See `CONTRIBUTING.md` for pull request and development guidelines.

License
-------
MIT. See `LICENSE`.

