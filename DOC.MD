# Running the project

## Prerequisites
- Docker + Docker Compose
- Node.js `20.20.2` (use `nvm use` inside `backend/` and `frontend/` — both pin the same version via `.nvmrc`)

## Option 1: Docker Compose (recommended)
Starts Postgres, Elasticsearch, the backend and the frontend together:

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Elasticsearch: http://localhost:9200
- Postgres: localhost:5432

Both `backend` and `frontend` run with hot-reload (`nest start --watch` / `vue-cli-service serve`), so code changes are picked up automatically.

## Option 2: VS Code Dev Container
1. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
2. Open the repo in VS Code and run "Dev Containers: Reopen in Container".

This brings up the same stack as Option 1 and gives you an editor attached to a container with the whole repo (`backend/` and `frontend/`) mounted, so you can edit and use the integrated terminal without installing Node locally.

## Option 3: Run locally without Docker
Requires a local Postgres and Elasticsearch instance.

**Backend**
```bash
cd backend
nvm use
npm install
DATABASE_URL=postgres://user:password@localhost:5432/mydatabase \
ELASTICSEARCH_HOST=http://localhost:9200 \
npm run start
```

**Frontend**
```bash
cd frontend
nvm use
npm install
npm run serve
```
