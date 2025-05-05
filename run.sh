#!/bin/bash


read -p "Введите новый IP адрес: " new_ip

# Проверка что ip не пустой
if [[ -z "$new_ip" ]]; then
  echo "IP адрес не может быть пустым!"
  exit 1
fi

# Замена
if grep -q "^HOST_IP=" .env; then
  sed -i '' "s/^HOST_IP=.*/HOST_IP=$new_ip/" .env
else
  echo "HOST_IP=$new_ip" >> .env
fi

echo "Новый IP адрес установлен: $new_ip"

# Сборка и запуск
docker-compose up --build -d

echo "Проект запущен!"
