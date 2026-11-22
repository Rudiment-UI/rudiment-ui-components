# rudiment-ui MCP server

An [MCP](https://modelcontextprotocol.io) server that gives coding agents (Claude Code, Cursor, VS Code Copilot, Codex, Claude Desktop) the rudiment-ui API: every component, prop, default, compound part and convention.

It ships inside the `rudiment-ui` package and reads the `dist/components.json` generated from that version's source. Its answers always match the version in your `node_modules`, with no network access, no account and no extra install.

## Quick start

Install the library, then register the server with your agent from the project root:

```bash
npm install rudiment-ui
claude mcp add rudiment-ui -- npx --no rudiment-ui-mcp        # Claude Code
```

Restart the agent (or run `/mcp` in Claude Code) and confirm that `rudiment-ui` is listed as connected. Then ask for UI as usual, for example "build a settings form with rudiment-ui". The server tells the agent to read the conventions first.

> **Why `npx --no`?** The `--no` flag stops npx from downloading anything when it can't find the binary. `rudiment-ui-mcp` is a binary inside the `rudiment-ui` package, not a package of its own on npm. Without the flag, a project that hasn't installed rudiment-ui would make npx try to fetch a package of that name from the registry.

## Client setup

Every client runs the same command: `npx --no rudiment-ui-mcp`, started from the project root.

**Claude Code**: for your machine only:
```bash
claude mcp add rudiment-ui -- npx --no rudiment-ui-mcp
```
or for everyone on the project (writes `.mcp.json`, which you commit):
```bash
claude mcp add --scope project rudiment-ui -- npx --no rudiment-ui-mcp
```

**`.mcp.json`** (Claude Code project scope) and **`.cursor/mcp.json`** (Cursor). Most other clients use the same `mcpServers` shape:
```json
{
  "mcpServers": {
    "rudiment-ui": { "command": "npx", "args": ["--no", "rudiment-ui-mcp"] }
  }
}
```

**VS Code** (`.vscode/mcp.json`):
```json
{
  "servers": {
    "rudiment-ui": { "type": "stdio", "command": "npx", "args": ["--no", "rudiment-ui-mcp"] }
  }
}
```

**Codex** (`~/.codex/config.toml`):
```toml
[mcp_servers.rudiment-ui]
command = "npx"
args = ["--no", "rudiment-ui-mcp"]
```

**Claude Desktop** and any client that doesn't start in your project folder: point `node` at the server file with an absolute path.
```json
{
  "mcpServers": {
    "rudiment-ui": {
      "command": "node",
      "args": ["/absolute/path/to/your-app/node_modules/rudiment-ui/mcp/server.mjs"]
    }
  }
}
```

## Tools

| Tool | Arguments | Returns |
| ---- | --------- | ------- |
| `get_conventions` | none | Library-wide rules: setup, `onPress` vs `onClick`, `onChange` values, required `label`, Iconify icons, layout primitives, theming, tokens. Agents should call it once before writing UI code. |
| `list_components` | `category?`: `component` \| `layout` \| `typography` \| `chart`. `query?`: substring | Every component and compound part with a one-line summary. |
| `get_component` | `name`: `"RudiSelect"`, `"Select"`, `"card.header"`, `"rudiToast"`. `includeInherited?`: boolean | Summary, examples, a props table (type, default, required, description), parts, `ref` target, inherited React Aria props, import line and source path. Unknown names return close suggestions. |
| `search` | `query`: keywords, all must match. `limit?` | Components, props, functions and types whose name or description matches, e.g. `"sticky header"`, `"dismiss"`, `"required"`. |

Resources: `rudiment-ui://conventions` (Markdown) and `rudiment-ui://components.json` (the full manifest), for clients that attach resources directly.

## Trying it by hand

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_component","arguments":{"name":"Button"}}}' \
  | npx --no rudiment-ui-mcp
```

Or browse it with the MCP Inspector: `npx @modelcontextprotocol/inspector npx --no rudiment-ui-mcp`.

## No MCP? Use the files

Every answer the server gives comes from files that ship in the package, so agents without MCP support can read them directly:

- `node_modules/rudiment-ui/dist/llms.txt`: conventions and the component index
- `node_modules/rudiment-ui/dist/llms-full.txt`: every prop table
- `node_modules/rudiment-ui/dist/components.json`: the manifest

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `npx: … could not determine executable to run` | rudiment-ui isn't installed in the folder the client started in. Run `npm install rudiment-ui`, or use the absolute-path setup above. |
| Tool calls return "manifest not found" | The package is missing `dist/`. Reinstall it. Inside the rudiment-ui repo itself, run `npm run build` first. |
| Answers look out of date | The server reads the installed version. Upgrade `rudiment-ui` and restart the agent so the server reloads. |
| Use a manifest from somewhere else | Set `RUDIMENT_UI_MANIFEST=/path/to/components.json` in the server's environment. |

## How it works

`npm run build` runs `scripts/component-docs.mjs`, which walks every export of `src/index.ts` with the TypeScript checker and writes `dist/components.json`. `mcp/server.mjs` is a zero-dependency stdio JSON-RPC server: MCP over stdio is newline-delimited JSON-RPC 2.0, and a UI library shouldn't make every consumer install an SDK. It renders Markdown with `mcp/render.mjs`, the same renderer that writes `llms*.txt`. It supports protocol versions 2024-11-05 through 2025-11-25. `mcp/server.test.mjs` drives the real binary over stdio.
