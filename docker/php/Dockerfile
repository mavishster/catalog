FROM php:8.2-fpm-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
        libpq-dev \
        git \
        unzip \
        curl \
        zip \
        libzip-dev \
        libonig-dev \
        libxml2-dev \
        pkg-config \
        libssl-dev \
        libicu-dev \
    && docker-php-ext-install pdo_pgsql bcmath mbstring zip intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
