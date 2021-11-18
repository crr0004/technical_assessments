# Quickstart
`npm install && npm run build && npm run start`

## Tests

`npm run test`

You can lint with `npm run lint`.

There are some lint warnings due to express and some empty implementations.


# Notes

I mainly architectured this around the idea that the core logic around handling the links should be abstracted away from what each link type needs. This is because the main axis of change is around modifying exist link behaviours and adding new ones.

Normally I wouldn't lean so heavily into functional programming, but rather use classes to represent the link types and have them extend of an abstract class, and then pass those classes into the core link business logic.

I didn't unit test the index.ts file because it holds the REST API and should ideally be done from a http perspective. E.G using postman/newman to create automated functional tests

Without a proper idea of what the consumer will be doing with this service, it is hard to properly architect and design the data structures.

## Areas of Improvement

Most are tagged throw TODOs in comments
- Validation errors should be handled through throwing errors and catching them at the top level