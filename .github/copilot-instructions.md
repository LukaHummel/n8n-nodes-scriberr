# n8n-nodes-scriberr Copilot Instructions

## Architecture Overview

This is an **n8n community node package** that provides integration with the Scriberr API (transcription, notes, chat, and summary services). The package uses the **declarative-style** node pattern, which handles HTTP requests automatically through routing configuration rather than manual `execute()` methods.

**Key architectural decision**: The Scriberr node (`nodes/Scriberr/Scriberr.node.ts`) consolidates all operations into a single node class with multiple resources (transcription, note, chat, summary) instead of separate nodes per resource. This reduces duplication while maintaining clear operation boundaries through `displayOptions`.

## Development Workflow

### Essential Commands

```bash
npm run dev          # Start n8n with hot reload (primary dev workflow)
npm run build        # Compile TypeScript to dist/
npm run lint         # Run n8n-specific linter (strict!)
npm run lint:fix     # Auto-fix lint issues
```

**Critical**: Always run `npm run lint` before committing. The n8n linter enforces strict conventions beyond standard ESLint/TypeScript checks (see Lint Rules below).

### Testing Changes

`npm run dev` starts n8n at http://localhost:5678 with your nodes loaded. Changes to `.ts` files trigger automatic rebuild and reload. Test by creating workflows in the n8n UI.

**No automated test suite exists** - manual testing in n8n UI is the validation approach.

## Declarative-Style Node Pattern

The Scriberr node uses n8n's **declarative/low-code style** for HTTP APIs. Key patterns:

### 1. Operation Routing (No Manual HTTP Calls)

Operations declare their HTTP details in the `routing` property:

```typescript
{
  name: 'Get',
  value: 'get',
  routing: { 
    request: { 
      method: 'GET', 
      url: '={{$parameter.host}}/api/v1/transcription/{{$parameter.transcriptionId}}' 
    } 
  }
}
```

**Never write manual `axios` or `fetch` calls** in declarative nodes - the framework handles it via routing config.

### 2. Parameter Binding

Parameters map to request parts through `routing.send` or `routing.request`:

- **Body**: `routing: { send: { type: 'body', property: 'content' } }`
- **Query string**: `routing: { request: { qs: { limit: '={{$value}}' } } }`
- **URL interpolation**: Use `={{$parameter.name}}` in the URL string

### 3. Conditional Display

Use `displayOptions` to show/hide parameters based on resource/operation:

```typescript
displayOptions: { 
  show: { 
    resource: ['transcription'], 
    operation: ['get', 'getStatus'] 
  } 
}
```

## Credential Architecture

Two credential types support different Scriberr auth methods:

1. **ScriberrApiKeyApi** (`credentials/ScriberrApiKeyApi.credentials.ts`)
   - Header-based auth: `X-API-Key: {{apiKey}}`
   - Used when node's `authentication` parameter = `'apiKey'`

2. **ScriberrJwtApi** (`credentials/ScriberrJwtApi.credentials.ts`)
   - Bearer token auth: `Authorization: Bearer {{accessToken}}`
   - Used when node's `authentication` parameter = `'jwt'`

Both credentials:
- Include `baseUrl` property (defaults to `https://scriberr.app`)
- Test connectivity via `GET /api/v1/transcription/models`
- Use `IAuthenticateGeneric` for automatic header injection

**Credential selection** is tied to the node's `authentication` parameter through `displayOptions` in the `credentials` array.

## Critical Lint Rules

The `@n8n/node-cli` linter enforces strict conventions:

### Naming Conventions

- **Credential classes/files**: Must end with `Api` suffix (e.g., `ScriberrApiKeyApi`, filename `ScriberrApiKeyApi.credentials.ts`)
- **Credential `name` property**: Must match class name in camelCase (e.g., `name = 'scriberrApiKeyApi'`)
- **Resource names**: Must be **singular** (e.g., `'transcription'` not `'transcriptions'`, `'note'` not `'notes'`)

### Registration Requirements

All nodes/credentials **must** be registered in `package.json` under the `n8n` block:

```json
"n8n": {
  "n8nNodesApiVersion": 1,
  "credentials": [
    "dist/credentials/ScriberrApiKeyApi.credentials.js",
    "dist/credentials/ScriberrJwtApi.credentials.js"
  ],
  "nodes": [
    "dist/nodes/Scriberr/Scriberr.node.js"
  ]
}
```

**Forgetting registration** causes security lint errors: "Node references credential X not defined in package".

### Property Requirements

- **Option arrays**: Must be alphabetically sorted by `name`
- **Default values**: Required for most parameters (especially `limit`, `status`)
- **typeOptions**: Required for numeric inputs (set `min`/`max` bounds)
- **Icon**: Every node must have an `icon` property (light/dark variants)

### Common Fixes

```bash
npm run lint:fix  # Auto-fixes ordering, some spacing issues
```

Manual fixes needed for: credential naming, resource singularization, missing defaults, package.json registration.

## File Structure Patterns

```
credentials/
  ScriberrApiKeyApi.credentials.ts   # API key auth
  ScriberrJwtApi.credentials.ts      # JWT auth

nodes/
  Scriberr/
    Scriberr.node.ts                 # Main node (declarative style)
    Scriberr.node.json               # Metadata (name, version, description)

package.json                          # MUST register all credentials/nodes in n8n block
tsconfig.json                         # Strict TypeScript config
eslint.config.mjs                     # Imports @n8n/node-cli config
```

**No shared transport layer** - declarative nodes don't need one. The `requestDefaults` property handles shared headers/config.

## Adding New Operations

1. Add operation object to the appropriate resource's `options` array
2. Define `routing: { request: { method, url } }`
3. Add parameters with `displayOptions: { show: { resource: ['X'], operation: ['Y'] } }`
4. Bind parameters via `routing.send` or `routing.request.qs`
5. Run `npm run lint:fix` and fix remaining issues
6. Test via `npm run dev`

## Adding New Credentials

1. Create `credentials/MyServiceApi.credentials.ts` (note `Api` suffix)
2. Set `name = 'myServiceApi'` (camelCase, matches class name)
3. Implement `authenticate` property for header/query injection
4. Add `test` property with validation endpoint
5. **Register in `package.json`** under `n8n.credentials`
6. Bind to node via `credentials` array with `displayOptions`

## Scriberr API Integration Notes

- **Base URL**: Configurable via credential `baseUrl` (defaults to `https://scriberr.app`)
- **Host parameter**: Node includes a `host` parameter defaulting to `={{$credentials.baseUrl}}` for URL construction
- **Resources**: transcription, note (singular), chat, summary (singular)
- **SSE endpoint**: `/api/v1/summarize` accepts `text/event-stream` (configured via Accept header override in `requestDefaults`)

API documentation: https://scriberr.app/api.html

## Common Pitfalls

1. **Forgetting package.json registration** → Security lint error
2. **Using plural resource names** → Lint error about singular convention
3. **Unsorted option arrays** → Lint error (run `lint:fix`)
4. **Missing parameter defaults** → Lint warning
5. **Manual HTTP calls in declarative nodes** → Breaks framework expectations, use `routing` instead
6. **Credential name mismatch** → Class name, `name` property, and filename must align with `-Api` suffix

## Publishing Checklist

1. Update `package.json`: name, author, repository URL, description
2. Replace README.md with user documentation (see `README_TEMPLATE.md`)
3. Run `npm run build` and verify no errors
4. Run `npm run lint` and ensure clean
5. Test all operations via `npm run dev`
6. `npm publish` (requires npm account)
7. Optional: Submit for n8n Cloud verification via [creators.n8n.io](https://creators.n8n.io/nodes)

## Key Resources

- [n8n Node Development Docs](https://docs.n8n.io/integrations/creating-nodes/) - Official guide
- [n8n Built-in Nodes Source](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes) - Production patterns
- [@n8n/node-cli](https://www.npmjs.com/package/@n8n/node-cli) - CLI tool docs
