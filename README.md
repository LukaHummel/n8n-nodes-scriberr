![Scriberr banner](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-scriberr

This repository contains an n8n community node that integrates with the Scriberr API — an audio transcription, summarization, notes, and chat service.

The node is implemented in the declarative style and exposes resources for Transcription, Summary, Note, Chat, Profile, Admin, API keys, Auth, Health, and LLM configuration.

Quick links
- Node file: `nodes/Scriberr/Scriberr.node.ts`
- Credentials: `credentials/ScriberrApiKeyApi.credentials.ts`, `credentials/ScriberrJwtApi.credentials.ts`

## Installation

Install dependencies and start the development server with hot reload:

```bash
npm install
npm run dev
```

This starts n8n with the node loaded (usually at http://localhost:5678) so you can test workflows in the UI.

## Operations

The node exposes these resources and common operations:

- Transcription: submit, upload, start, get, list, status, transcript, summary, kill, delete, get models, quick transcription
- Summary: list templates, get/create/update/delete templates, save/get settings, summarize (SSE)
- Note: create, list for transcription, get, update, delete
- Chat: create session, list sessions for transcription, get session, send message, update session title, delete session, get models
- Profile: create, update, delete, list, set default
- Admin: queue stats
- API Key: list, create, delete (requires JWT)
- Auth: login, logout, register, change password/username, registration status
- LLM: get/set configuration
- Health: health check

Use the node's `Resource` dropdown to pick a resource and `Operation` to pick the action.

## Credentials

Two credential types are provided:

- `Scriberr API Key API` (`scriberrApiKeyApi`)
  - Auth method: X-API-Key header
  - Properties: `baseUrl`, `apiKey`
  - Test endpoint: `/api/v1/transcription/models`

- `Scriberr JWT API` (`scriberrJwtApi`)
  - Auth method: Bearer token in `Authorization` header
  - Properties: `baseUrl`, `accessToken`
  - Test endpoint: `/api/v1/transcription/models`

Notes on auth selection
- Some Scriberr endpoints (for example API key management and admin operations) require JWT (Bearer) authentication. The node includes notices on resources that require JWT to avoid confusion.
- Summary operations support both API Key and JWT authentication; either credential type should work when configured correctly.

How to obtain a JWT
1. Use the node's `Auth` → `Login` operation with username/password to receive a JWT access token.
2. Paste that token into a `Scriberr JWT API` credential and save.

## Quick usage / testing

1. Health check (no auth required): Resource `Health` → `Health Check`
2. Test API Key: create a `Scriberr API Key API` credential (set `baseUrl` and `apiKey`) and click Test
3. Test JWT: login with `Auth` → `Login`, copy `accessToken`, create `Scriberr JWT API` credential and Test
4. List summary templates: Resource `Summary` → `List Templates` (choose the credential that matches your server configuration)

Tip: ensure `baseUrl` is set to your instance URL (no trailing slash) and that you're using the correct credential for the selected operation.

## Compatibility

- Minimum n8n version: tested with n8n 1.x (use latest stable for best compatibility)

## Development scripts

-| Script | Description |
-|--------|-------------|
-| `npm run dev` | Start n8n with hot reload (use for local testing) |
-| `npm run build` | Compile TypeScript to JavaScript (dist/) |
-| `npm run lint` | Run linter checks |
-| `npm run lint:fix` | Auto-fix lintable issues |

## Troubleshooting

- If requests return 401 with `Missing authentication` or the server logs show the base URL being used as the API key (e.g. SQL selecting where key = "http://..."), verify these:
  1. The credential selected in the node matches the `Authentication` field (`API Key` vs `JWT`).
  2. The credential values are correct: `baseUrl` is the server URL and `apiKey` is the actual key (not the URL). For JWT, `accessToken` must be a valid token.
  3. No trailing slash is present in `baseUrl`.
  4. If you changed credentials, restart the dev server (`npm run dev`) to ensure changes are picked up in the runtime.

## Resources

- Scriberr API docs: https://scriberr.app/api.html
- Node implementation: `nodes/Scriberr/Scriberr.node.ts`

## Contributing

Found a bug or missing operation? Please open an issue or submit a pull request. Use `npm run lint` and `npm run build` before submitting changes.

## License

MIT
