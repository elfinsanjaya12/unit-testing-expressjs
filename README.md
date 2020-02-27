# Demo NodeJS REST Api

## Requirement
For running this project please install nodejs and postgresql.

Node.js:
```
node --version
v12.13.0
```
PostgreSQL:
```
psql --version
psql (PostgreSQL) 11.2
```

## Getting Started to the development
Clone the repository :
```
git clone https://github.com/elfinsanjaya12/unit-testing-expressjs.git
```
Switch to the repo folder :
```
cd unit-testing-expressjs
```
Install all the dependencies using `npm` or you can using `yarn` :
```
npm install or yarn install
```
Set configuration database like on your environtment system,to the config file on mode `development` in file `config/config.js` :
```
"development": {
    "username": "DATABASE_USER_NAME",
    "password": "DATABASE_PASSWORD",
    "database": "DATABASE_NAME",
    "host": "DATABASE_HOST",
    "dialect": "postgres"
  },
```

Run the server :
```
npm run start
```
You can now access the server at http://localhost:3000

## Run The Test

Run test
```
npm run test
```
You can see the result coverage testing :
```
------------------------------------|---------|----------|---------|---------|----------------------------------------------------
File                                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------------|---------|----------|---------|---------|----------------------------------------------------
All files                           |   84.17 |    68.97 |      95 |   87.12 | 
 unit-testing-expressjs             |     100 |      100 |     100 |     100 | 
  app.js                            |     100 |      100 |     100 |     100 | 
 unit-testing-expressjs/controllers |   66.13 |       50 |    87.5 |   71.43 | 
  userController.js                 |   66.13 |       50 |    87.5 |   71.43 | 13,40,52,64,88,100-102,106,108-110,112,117,139,164
 unit-testing-expressjs/middlewares |     100 |     87.5 |     100 |     100 | 
  auth.js                           |     100 |    83.33 |     100 |     100 | 16
  validator.js                      |     100 |      100 |     100 |     100 | 
 unit-testing-expressjs/models      |   97.06 |    77.78 |     100 |   97.06 | 
  index.js                          |      95 |    77.78 |     100 |      95 | 13
  user.js                           |     100 |      100 |     100 |     100 | 
 unit-testing-expressjs/routers     |     100 |      100 |     100 |     100 | 
  users.js                          |     100 |      100 |     100 |     100 | 
------------------------------------|---------|----------|---------|---------|----------------------------------------------------
Done in 6.11s.
  users.js                          |     100 |      100 |     100 |     100 | 
------------------------------------|---------|----------|---------|---------|----------------------------------------------------
Done in 6.11s.
```