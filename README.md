# Catalog — Laravel 12 + Inertia (Vue 3) Application

Простое веб‑приложение — **каталог товаров** с публичной частью и административной панелью для управления товарами.

## 🧰 Стек технологий

- Backend: Laravel 12, PHP 8.2+, REST API, Laravel Sanctum
- Frontend: Vue 3 (Composition API), InertiaJS, Vite, Tailwind CSS, Element Plus
- База данных: PostgreSQL

---

## 📌 Основной функционал

### Публичная часть

- Просмотр списка товаров с пагинацией
- Фильтрация товаров по категориям
- Страница одного товара с подробной информацией

### Админ‑панель (требуется авторизация)

- Вход с логином/паролем (Sanctum)
- Добавление, редактирование и удаление товаров
- Управление категориями
- Токен хранится в `localStorage`

### API‑эндпоинты

- `GET /api/products` — список товаров
- `GET /api/products/{id}` — один товар
- `GET /api/categories` — список категорий
- `POST /api/login` — аутентификация, возвращает токен
- `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}` — создание, редактирование, удаление товара (защищено)

### Структура данных

#### Товар (Product)

- `id`
- `name`
- `description`
- `price`
- `category_id`
- `created_at`

#### Категория (Category)

- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

#### Связи

- Один товар принадлежит одной категории
- Одна категория может иметь много товаров

### Валидация товаров

- `name` — обязательное
- `price` — обязательное, больше 0
- `category_id` — должна существовать

---

## 🚀 Быстрый старт

### Требования

- PHP 8.2+
- Composer 2+
- Node.js 18+ и npm
- OpenSSL и расширение PDO для PHP

### Быстрый запуск

```bash
git clone <repo-url>
cd catalog

# Одноразовая настройка проекта
composer run setup

# Запуск dev-сервера (Laravel) и Vite
composer run dev
```

После запуска:

- Backend API: http://127.0.0.1:8000
- Frontend (Vite): http://127.0.0.1:5173

### Детальная установка

1. Клонировать проект

```bash
git clone <repo-url>
cd catalog
```

2. Настроить `.env` и ключ приложения

```bash
cp .env.example .env
php artisan key:generate
```

3. Настроить подключение к базе данных (PostgreSQL)

#### PostgreSQL: настройка и использование

- Требуется установленный PostgreSQL (рекомендуется 14+).
- Создайте пользователя и базу данных, либо используйте Docker (см. ниже).

1) Пример настроек в `.env` для PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=catalog
DB_USERNAME=catalog
DB_PASSWORD=secret
```

2) Создание пользователя и базы (локально через psql):

```bash
# Подключиться как superuser (например, postgres)
psql -U postgres

-- Внутри psql:
CREATE USER catalog WITH PASSWORD 'secret';
CREATE DATABASE catalog OWNER catalog;
GRANT ALL PRIVILEGES ON DATABASE catalog TO catalog;
```

Если используется аутентификация peer/ident и psql просит системного пользователя — выполните `sudo -u postgres psql` (Linux) или подключитесь через GUI (pgAdmin, TablePlus) и выполните те же SQL-команды.

3) Вариант через Docker (без локальной установки):

```bash
docker run --name catalog-postgres -e POSTGRES_USER=catalog \
  -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=catalog \
  -p 5432:5432 -d postgres:15
```

После старта контейнера используйте настройки из примера `.env` выше. Убедитесь, что порт 5432 не занят другой БД.

4) Применение миграций/сидов (после настройки .env):

```bash
php artisan migrate --seed
```

5) Полезные команды для PostgreSQL:

- Подключение к БД: `psql postgresql://catalog:secret@127.0.0.1:5432/catalog`
- Сброс БД с сидерами: `php artisan migrate:fresh --seed`
- Резервная копия: `pg_dump -U catalog catalog > backup.sql`
- Восстановление: `psql -U catalog -d catalog -f backup.sql`

Troubleshooting:

- FATAL: password authentication failed — проверьте `DB_USERNAME/DB_PASSWORD` и актуальность пользователя в PostgreSQL.
- Connection refused — проверьте, что сервер PostgreSQL запущен и слушает `DB_HOST:DB_PORT` (для Docker — порт проброшен, контейнер в статусе healthy).
- Peer authentication failed — смените метод аутентификации в `pg_hba.conf` на md5/scram-sha-256 для нужного пользователя или подключайтесь через пароль.

4. Установить зависимости

```bash
composer install
npm install
```

5. Применить миграции и сидеры

```bash
php artisan migrate --seed
```

6. Запустить сервера разработки

```bash
composer run dev
```

### Production‑сборка

```bash
npm run build
php artisan config:cache
php artisan route:cache
```

Деплойте `public/` через Nginx/Apache с указанием `public/index.php`.

### Полезные команды

- Запуск тестов: `php artisan test`
- Очистка кэшей: `php artisan optimize:clear`
- Пересоздание БД с сидерами: `php artisan migrate:fresh --seed`

