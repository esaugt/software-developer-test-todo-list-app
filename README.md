# Local Development (Docker Compose + Vite Proxy + php-fpm/nginx)

This monorepo includes:
- `/todo-list-app-api` → Laravel API (php-fpm) served by **nginx**  
- `/frontend-todo-list-app` → SPA (Vite/React) with a **proxy** to the API in development  

## Ports
- **Frontend (Vite):** [http://localhost:5173](http://localhost:5173)  
- **API (nginx → php-fpm):** [http://localhost:8000](http://localhost:8000)  
- **Postgres:** `127.0.0.1:55432`  

> During development, always use relative paths like `/api` from the frontend.  
> The Vite proxy will forward requests to the `api:8000` container.  
> **Do NOT** call the backend directly with `http://localhost:8000` from the frontend.  

## Requirements
- Docker Engine **20+** / Docker Desktop  
- Docker Compose **v2**  

## First Run
1. Build and start the containers:  
   ```bash```
   docker compose up -d --build 
2. Install PHP dependencies: 
docker compose exec api composer install

3. Run migrations and seed the database:
docker compose exec api php artisan migrate --seed

4. Open in browser:
http://localhost:5173
