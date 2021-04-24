# prisma-data-api

## Idea

Middleware that intercepts all Prisma queries and translates them into a HTTP request against a long running server that executes the same query against the database and returns the result as the HTTP response, which is then returned for the original query.

## Implementation steps

- Tiny app using Prisma to run 1 query
- Confirm middleware can completely skip actual query execution and return whatever
- Send request to URL that contains query information as payload
- Webserver that accepts data and constructs a query out of that, and executes it
- Middleware accepts returned data as result of query and returns it to the app