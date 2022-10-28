#!/usr/bin/env sh

#остановить публикацию при ошибках
set -e

#сборка
npm run build

#переход в каталог сборки
cd dist

#Инициализация репозитория и загрузка кода
git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/varaeff/skillbox_vue-app.git master:gh-pages

cd -