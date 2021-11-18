# Quickstart
`npm install && npm run build && npm run start`

## Example requests

### Create a classic link
`curl http://localhost:3000/link/classic -H "Content-Type: application/json" -X POST -d @data/link.json`

### Create a shows link but errors
`curl --verbose http://localhost:3000/link/shows -H "Content-Type: application/json" -X POST -d @data/link.json`

### Get all links
`curl http://localhost:3000/link/yourname`

`curl http://localhost:3000/link/yourname?sort=true`


## Tests

`npm run test`

You can lint with `npm run lint`.

There are some lint warnings due to express and some empty implementations.


# Notes

I mainly architectured this around the idea that the core logic around handling the links should be abstracted away from what each link type needs. This is because the main axis of change is around modifying exist link behaviours and adding new ones.

Normally I wouldn't lean so heavily into functional programming, but rather use classes to represent the link types and have them extend off an abstract class, and then pass those classes into the core link business logic.

The core business logic could then be functional.

I didn't unit test the index.ts file because it holds the REST API and should ideally be done from a http perspective. E.G using postman/newman to create automated functional tests. I also had a hard time finding a decent way to unit test the express framework. Even with splitting the handling functions out, it became fragile trying to create the fixtures for the express objects.

Without a proper idea of what the consumer will be doing with this service, it is hard to properly architect and design the data structures.

## Database Schema
To start I would just have it as NoSQL. The userID would be inside the link object sent.

I woud start with NoSQL because it is the easier to setup, maintain, operate and scale. If the schema for links did change, you would need to manage this and might be difficult for NoSQL.

If data became more relation, or needed a stronger schema, then it might be wise to switch SQL. SQL is harder to setup, maintain, operate and scale though.


Each user would store all links in one document if the amount of links each user has was small enough.

E.G De-Normalized links
| userId |  Document |
| --- | --- |
| yourName | JSON Object of all links |

If you really needed to have the links split out into documents you can could index on the userID inside the document when you need all the links.

E.G
| key |  Document |
| --- | --- |
| key | JSON Object of link with userId inside |


## Areas of Improvement

Most are tagged throw TODOs in comments or mentioned above
- Some functions would need to be changed to async once I/O is being done