# College Mate Server

## Setting up environment
- Setup environment using the following LAMP setup tutorial, followed by laravel setup document

https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu

http://laravel.com/docs/5.1

## Setting up repository
- Clone this repository
- Copy .env.dist as .env in the root directory using the following command
```
cp .env.dist ./.env
```
- Run the key generation command from root directory
```
php artisan key:generate
```
- Change the database settings in `.env` file. 
- Login to local mysql and create a database with name `college_mate`
```
create database college_mate 
```
- Test migrations, run 
```
php artisan migrate
php artisan migrate:reset
```
- Errors during above process indicate wrong setup 