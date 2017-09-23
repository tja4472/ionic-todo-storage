With thanks to https://github.com/lathonez/clicker

### package.json
``` json
  "dependencies": {
    "@angular/router": "4.1.3",
  },
  "devDependencies": {
    "@angular/cli": "1.3.2",
    "@types/jasmine": "2.5.54",
    "@types/node": "7.0.12",
    "ionic-mocks": "0.13.0",    
    "jasmine-core": "2.6.2",
    "karma": "1.7.0",
    "karma-chrome-launcher": "2.1.1",
    "karma-cli": "1.0.1",
    "karma-coverage-istanbul-reporter": "1.2.1",
    "karma-jasmine": "1.1.0",
    "karma-jasmine-html-reporter": "0.2.2",
    "karma-junit-reporter": "1.2.0",    
```
### root
```
.angular-cli.json
karma.conf.js
tsconfig.ng-cli.json
```
### src
```
polyfills.ts
test.ts
tsconfig.spec.json
```
Comment out ClickersServiceMock & ClickersService.
### tsconfig.json
``` json
  "exclude": [
    "node_modules",
    "src/test.ts",
    "**/*.spec.ts"
  ],
```
### package.json
``` json
  "scripts": {
    ...
    "test": "ng test",        
    "test-coverage": "ng test --code-coverage"
  },
```