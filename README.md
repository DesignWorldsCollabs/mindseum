Mindseum [ ![Circle CI status DesignWorldsCollabs/mindseum](https://circleci.com/gh/DesignWorldsCollabs/mindseum/tree/master.svg?style=shield&circle-token=eee95666e90933e62945c3d06d4da35a91a48a73)](https://circleci.com/gh/DesignWorldsCollabs/mindseum/tree/master)
========

Testing
-------

A webdriver is required. Install with

```
npm run install-webdriver
```

Start a local server

```
npm start
```

then in a separate terminal run the test suite on it with

```
npm test
```

Writing Tests
-------------

```
protractor spec/conf.js --elementExplorer
```

then since we're not using Angular

```
browser.ignoreSynchronization = true;
browser.get('http://localhost:3000/'); // or other page
```
