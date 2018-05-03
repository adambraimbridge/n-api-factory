# n-api-factory [![npm version](https://badge.fury.io/js/%40financial-times%2Fn-api-factory.svg)](https://badge.fury.io/js/%40financial-times%2Fn-api-factory) [![CircleCI](https://circleci.com/gh/Financial-Times/n-api-factory.svg?style=shield)](https://circleci.com/gh/Financial-Times/workflows/n-api-factory) [![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-api-factory/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-api-factory?branch=master) [![Dependencies](https://david-dm.org/Financial-Times/n-api-factory.svg)](https://david-dm.org/Financial-Times/n-api-factory) [![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/n-api-factory/badge.svg)](https://snyk.io/test/github/Financial-Times/n-api-factory)

api service creator using `n-fetch` pattern, throws `n-error`, friendly to `n-auto-logger`, `n-auto-metrics` 

- [quickstart](#quickstart)
- [install](#install)
- [usage](#usage)
  * [extend error handling](#extend-error-handling)
  * [default headers](#default-headers)
  * [extend headers](#extend-headers)
  * [auto log and metrics](#auto-log-and-metrics)
- [example](#example)

## quickstart

```js
import setupService from '@financial-times/n-api-factory';

const yourApiService = setupService({
  API_HOST: process.env.YOUR_API_SERVICE_HOST,
  API_KEY: process.env.YOUR_API_SERVICE_KEY,
});

export const getSomeResource = (
  { someId, paramA, paramB }, 
  { transactionId, metaB }
) => yourApiService.get({
  endpoint: `/some-endpoint/${someId}`,
  query: { paramA, paramB },
  meta: { transactionId, metaB },
});

export const addSomeResource = (body, meta) => yourApiService.post({
  endpoint: `/some-endpoint/`,
  body,
  meta,
});

export const deleteSomeResource = ({ someId }, meta) => yourApiService.delete({
  endpoint: `/some-endpoint/${someId}`,
  meta,
}); // would return `undefined` if response `NO-CONTENT`
```

## install
```shell
npm install @financial-times/n-api-factory
```

## usage

### extend error handling
```js
import nError, { CATEGORIES } from '@financial-times/n-error';

export const getAddress = async (params, meta) => {
  try {
    const address = await addressService.get({ endpoint, meta });
    
    if(validate(address)){
      throw nError.unauthorised({ message: 'some message' }); // throw an nError of CUSTOM_ERROR category
    }
    
    return address;
  } catch(e) {
    throw e;
  }
};

export const addAddress = async ({ body }, meta) => {
  try {
    await addressService.post({ endpoint, body, meta });
  } catch(e) {
    if(e.category === CATEGORIES.FETCH_RESPONSE_ERROR) {
      const message = parseErrorMessage(e);
      throw e.extend({ message }); // override .message to concise the log in this example
    }
    throw e; // throw other error categories: FETCH_NETWORK_ERROR, CUSTOM_ERROR, SYSTEM_ERROR
  }
};
```

### default headers
```js
trimObject({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
  'FT-Transaction-Id': transactionId,
  'X-Origin-System-Id': `https://cmdb.ft.com/systems/${systemId}`, // default to process.env.SYSTEM_CODE
  'X-Origin-User': user, // default to 'customer'
});
```

### extend headers
```js
export const addSomeResource = ({ body }, meta) => yourApiService.post({
  endpoint: `/some-endpoint/`,
  body,
  meta,
  headers, // would be merged to default headers
});
```

### auto log and metrics
```js
export default compose(
  tagService('name-of-api-service'),
  metricsAction,
  logActions,
)({
  getSomeResource,
  addSomeResource,
  deleteSomeResource
});
```
