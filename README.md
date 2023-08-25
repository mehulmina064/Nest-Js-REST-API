## Installation

```bash
$ npm install
or
$ npm install - force  //if getting version issues

And then-
  npm install tslib //because of the version issues
  npm install cache-manager@4.0.0 --save  //because of the version issues
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## MongoDB Database
# Download MongoDB Tools for Your Operating System
$ mongorestore  --uri="mongodb://root:example@localhost:27017/" db/dump/

## MongoSH
$ db.createUser({
 user:"beastab",
 pwd:"beastab",
 roles:[{role: "userAdminAnyDatabase" , db:"admin"}]})


  

