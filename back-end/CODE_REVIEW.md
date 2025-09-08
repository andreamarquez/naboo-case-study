# Backend Code Review Suggestions

## Good practices

- Clean NestJS architecture with proper module separation and dependencies injection
- GraphQL by code-first -> auto-generation of graphql schemas
- JWT authentication with guards
- MongoDB with Mongoose
- Environment configuration with ConfigModule
- Proper TypeScript usage
- Clean and easy to read logic, well separated by area (services by activities, users, etc)
- Uniform code style, naming format is consistent
- Basic health check endpoint exists

## Security Issues

Password Field Exposed in GraphQL Schema
File: `src/user/user.schema.ts`

Weak or no error Messages in Authentication
File: `src/auth/auth.service.ts`

## Architecture Improvements

For the service layer
- Missing pagination and limits for large datasets

Db Query Optimization, file: `src/activity/activity.service.ts`
- No db indexes defined for frequently queried fields
- Cities list don't change as much, could be cached

For local dev:
- For the start:db script, docker-compose could be daemonized `docker-compose up -d`
- nvm could be used for handling node version usage and a .nvmrc file, to just use `nvm use``
- No explicit node version is demanded on the readme (using nvmrc file solves this too)
- Added a docker-compose file to be able to launch the app
- readme could be updated for the .env.dist file that needs to be copied and replaced on a
pertinent local .env file to run the project.

## Testing Improvements

- Limited test scenarios
- No integration tests

## Monitoring
While basic health check endpoint exists,
we could add more checks, like db health check

