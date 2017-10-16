# SG Fundamentals

A web app that lets you share your study material, along with answers and comments for everyone to see and contribute. You can see it working on [sgfundamentals.herokuapp.com](https://sgfundamentals.herokuapp.com/).

To test as a normal user, log in as `user: user1; password: user`, or if you want to log as admin `user: admin; password: admin`. 

## Template

Template built with [koa](http://koajs.com/) for IIC2513 - Tecnologías y Aplicaciones Web, Pontificia Universidad Católica de Chile.

## Prerequisites:
* [PostgreSQL](https://github.com/IIC2513-2017-2/syllabus/wiki/Getting-Started#postgresql)
  * you will need a database with name and user/password as configured in `src/config/database.js`
* [Node.js v8.4.0](https://github.com/IIC2513-2017-2/syllabus/wiki/Node.js) or above
* [Yarn](https://yarnpkg.com)

## Project Setup

* Clone repository
* Install dependencies:
  * `yarn install`

## Database Setup (development)

### Install postgresql
* On Mac OS X using Homebrew: `brew install postgresql`
  * Start service: check [LaunchRocket](https://github.com/jimbojsb/launchrocket) or [lunchy](https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/) for postgresql service management
* [Other platforms](https://www.postgresql.org/download/)
* [More details](https://github.com/IIC2513-2017-2/syllabus/wiki/Getting-Started#postgresql)

### Create development database

```sh
createdb iic2513template_dev
```

### Define environment variables

```sh
export DB_USERNAME=<your_psql_username> DB_PASSWORD=<your_psql_password>
```

### Run migrations
```sh
./node_modules/.bin/sequelize db:migrate
```

### Run seeds
```sh
./node_modules/.bin/sequelize db:seed:all
```

## Run the app!

```sh
yarn start
```

or directly

```sh
node index.js
```

or, if you want automatic restart after any change in your files

```sh
yarn dev
```

or directly

```sh
./node_modules/.bin/nodemon
```

Now go to http://localhost:3000 and start browsing :)

Remember to 

```sh
./node_modules/.bin/sequelize db:migrate:undo:all
./node_modules/.bin/sequelize db:migrate
./node_modules/.bin/sequelize db:seed:all
```
each time you pull an updated version!
