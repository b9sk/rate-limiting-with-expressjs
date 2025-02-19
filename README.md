## Requirments
- Debian 12
- Nodejs 18

## Getting started
- `npm i`
- `npm run watch:vanilla` - no 3rd party

## TODO

### Main example without modules
Implement middleware with Time Bucketed algo

- [x] index.ts uses vanilla approach with no 3rd party libs. It stores data in `loginAttempts` variable.

### [wip] Example with 3rd party
Use 3rd party Rate Limiting module.

- `express-rate-limit` doesn't support block time out of the box
- you may use `express-brute` instead or 
- implement the feature in `express-rate-limit`'s handler


- (optional) make a feature test, eg by jest
