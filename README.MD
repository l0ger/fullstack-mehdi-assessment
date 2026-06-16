# Running the project

## Prerequisites
- Docker + Docker Compose
- Node.js `20.20.2` (use `nvm use` inside `backend/` and `frontend/` — both pin the same version via `.nvmrc`)

Both `backend` and `frontend` run with hot-reload (`nest start --watch` / `vue-cli-service serve`), so code changes are picked up automatically.

## How to run dev servers using VS Code Dev Container
1. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
2. Open the repo in VS Code and run "Dev Containers: Reopen in Container".

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- API docs (Swagger UI): http://localhost:3000/api
- Elasticsearch: http://localhost:9200
- Postgres: localhost:5432

## What's implemented

All three required features, plus both bonuses:
- **Cocktail detail view** — click a cocktail on the list to see its details (`/cocktails/:id`).
- **Search by description** — the list page's search box filters cocktails by description.
- **API error feedback** — e.g. adding a second "Nojito" on the new-cocktail page shows a clear error instead of failing silently.
- **Bonus: fuzzy search** — search also matches typos (e.g. "mojiot" still finds "Mojito"), backed by Elasticsearch.
- **Bonus: OpenAPI docs** — see the Swagger UI link above.

## Running the backend tests

```bash
cd backend
npm install
npm test       # unit tests
npm run test:e2e  # API integration tests
```

No frontend unit tests: the frontend boilerplate had no test framework set up at all, and adding one just for a couple of small UI changes (search filter, error display) felt like more setup/maintenance overhead than the actual change warranted for this assessment.
