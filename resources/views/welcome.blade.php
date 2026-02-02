<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Каталог Товаров</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Scripts / Styles -->
    @vite(['resources/js/catalog.js'])
</head>
<body class="h-screen m-0">
<!-- Make Vue root full height -->
<div id="app" class="h-screen flex flex-col">
    <!-- Vue mounts here -->
</div>
</body>
</html>
