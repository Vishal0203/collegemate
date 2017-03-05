FROM ubuntu:16.04
MAINTAINER Vishal Sharma "vish.sharma0203@gmail.com"

WORKDIR /var/www/collegemate
RUN apt-get update && apt-get install -y python python-pip nginx php-fpm php-mysql php-mbstring php-zip supervisor
RUN mkdir -p /var/run/php

COPY . /var/www/collegemate
RUN rm /etc/nginx/sites-available/default
COPY ./configurations/collegemate /etc/nginx/sites-available/default
COPY ./supervisor_config/supervisor_prod.conf /etc/supervisor/conf.d/supervisord.conf

RUN php artisan key:generate --force
RUN php artisan migrate --force
RUN php artisan config:cache
RUN php artisan route:cache

RUN chown -R www-data:www-data /var/www/collegemate
RUN chmod -R 775 /var/www/collegemate/storage
RUN chmod -R 775 /var/www/collegemate/bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n"]
