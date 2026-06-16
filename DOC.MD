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
- Elasticsearch: http://localhost:9200
- Postgres: localhost:5432
