# --- Build Frontend ---
FROM node:20-alpine AS web-build
WORKDIR /app
COPY frontend-todo-list-app/package*.json ./
RUN npm ci
COPY frontend-todo-list-app/ ./
RUN npm run build

# --- Build Backend (Composer) ---
FROM php:8.2-cli-alpine AS api-build
RUN apk add --no-cache git unzip libpq-dev && docker-php-ext-install pdo pdo_pgsql
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY todo-list-app-api/composer.json todo-list-app-api/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress
COPY todo-list-app-api/ ./
RUN composer dump-autoload --optimize

# --- Runtime ---
FROM php:8.2-cli-alpine AS runtime
RUN apk add --no-cache libpq
WORKDIR /var/www/html

# Copy backend + vendor
COPY --from=api-build /var/www/html /var/www/html

# Copy the build from front to public/
COPY --from=web-build /app/dist ./public

# Expose the API/Laravel port
EXPOSE 8080

# Typical variables; PORT optional if you want UI on 8080
ENV APP_ENV=production \
    APP_DEBUG=false \
    PORT=8080

# Start:
# - Generate APP_KEY if missing
# - Run migrations (requires accessible DB; if no DB is ready in your prod environment, remove this line)
# - Serve the app (php -S) on 0.0.0.0:8080
CMD sh -c '\
    if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then php artisan key:generate --force; fi && \
    if [ "$RUN_MIGRATIONS" = "true" ]; then php artisan migrate --force; fi && \
    php -S 0.0.0.0:${PORT:-8080} -t public \
    '
