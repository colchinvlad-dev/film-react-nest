FROM nginx:1.25-alpine

# Копируем конфигурацию nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Директория куда будет смонтирован собранный фронтенд
RUN mkdir -p /var/www/frontend

EXPOSE 80