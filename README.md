# prisma-data-api

## Idea

Middleware that intercepts all Prisma queries and translates them into a HTTP request against a long running server that executes the same query against the database and returns the result as the HTTP response, which is then returned for the original query.

## How to run this

Open 2 terminals.

Terminal 1:
```
npx ts-node ./src/server.ts
```

Terminal 2:
```
npx ts-node ./src/data-api.ts
```

## Results

### Local Data-API

#### Local Postgres (via Docker)

##### direct
```
{ measurements: { outside_main: 0.2013764, inside_main: 0.3368725 } }
{ measurements: { outside_main: 0.199631, inside_main: 0.3269561 } }
{ measurements: { outside_main: 0.1766611, inside_main: 0.2958311 } }
```

##### data-api
```
{ measurements: { outside_main: 0.2137056, inside_main: 0.4617874 } }
{ measurements: { outside_main: 0.2361446, inside_main: 0.322266 } }
{ measurements: { outside_main: 0.2288284, inside_main: 0.3089598 } }
```

#### Remote Postgres (via DigitalOcean.com)

##### direct
```
{ measurements: { outside_main: 0.1696572, inside_main: 7.253998 } }
{ measurements: { outside_main: 0.1759385, inside_main: 6.8606965 } }
{ measurements: { outside_main: 0.1712202, inside_main: 7.1715646 } }
```

##### data-api
```
{ measurements: { outside_main: 0.2497754, inside_main: 6.5508601 } }
{ measurements: { outside_main: 0.1985085, inside_main: 4.3599453 } }
{ measurements: { outside_main: 0.2354712, inside_main: 4.4273763 } }
``` 

### Remote Data-API

TODO

## Limitations

- `$connect` and `$disconnect` do not work as expected
- `new PrismaClient()` does some work that would in theory not be necessary

## Implementation steps

- Tiny app using Prisma to run 1 query
- Confirm middleware can completely skip actual query execution and return whatever
- Send request to URL that returns static data
- Middleware accepts returned data as result of query and returns it to the app
- Request accepts query parameters as payload, constructs query out of that, executes it and returns result
