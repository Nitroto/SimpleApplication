# SimpleApplication
- Node.js 16 Typescript and Express for back-end
- Angular 13 for front-end

## Run in Vagrant virtual environment with virtualbox provider
`$ vagrant up`  


## Run on local machine
`$ docker compose up --build -d`


## Run on development mode
### Database
- PostgreSQL configuration
  - database name: simple_db
  - owner: postgres
  - password: postgres


### Back-end
`$ cd simple-backend`

`$ npm install`

`$ npm migrate`

`$ npm start`


### Front-end
`$ cd simple-frontend`

`$ npm install`

`$ ng build`