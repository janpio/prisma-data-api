# prisma-data-api

Idea: Middleware that intercepts all Prisma queries and translates them into a HTTP request against a long running server that executes the same query against the database and returns the result as the HTTP response, which is then returned for the original query.
