# moviechallenge  Code Challenge

This is the back-end for my submission to the moviechallenge  code challenge

## Purpose

This service is built to serve as a sort of integration layer between the client and the moviechallenge
provided API. This is because the provided API is unreliable and seemingly randomly returns bad gateway
or other errors when it is being called. The idea is that this integration layer will add some stability 
to the client side.

Some of the logic could be applied on the client side (specifically retry logic) but this API layer could be built upon
to provide other functionality that wouldnt be appropriate on the client side. e.g. if we wanted to get the most recent movies, 
from a list of 10,000, we wouldnt want to return 10,000 items to the client and make the browser do that logic.

In a real world scenario this service could be hosted on a cloud provider and scaled up/down as needed when
we dont have control of the actual data source API.

## What it does
This solution exposes a few endpoints and provides a better experience for any client wanting to receive 
movies from the original API.

- It caches every request using springs in-built annotation driven caching mechanisms
- It retries on requests up to 3 times, so even if the cache has not been built, there is a better chance of 
actually retrieving the data. This is a trade-off because it will make the request a lot slower, but the caching should 
mean this is not a major issue.
- Provides a new endpoint at /movie which takes a query parameter called name, and returns the movie from each provider based 
on the name. This is to satisfy the need for the front end to get a specific movie.

## Assumptions
- Assuming the cache never needs to be cleared
- Assuming that name is a better match across two providers than ID. Even though the IDs appear to be the same but 
just with fw or cw infront of them. If we make the assumption these are keys in each providers DB in a real world scenario 
using them wouldnt help.
- Assuming title of movie is an exact match across providers

## What it uses
This project was initialised with spring initializer (https://start.spring.io/) and uses spring boot. There are 
minimal dependencies (only spring-retry to allow retries).

The java version used was 11, but this would likely work on 9 too.

The project is built using mvn and you will need 3.6+

## How to run it

`mvn clean install` to install and run tests
`mvn spring-boot:run` to run on port 8080

## What could be improved
- The error handling isnt very good, this is also driven by the fact that the error handling on the original
API is not very good. 
  - If you could the original API enough times `https://challenge.moviechallenge.com.au/api/cinemaworld/movie/{ID}` you will
get a BAD GATEWAY 502 error. But if you call it with an invalid movie ID, you just get an "Internal Server Error" which 
is marked 502 response also. This makes it hard to pass a 404 error back to the client to let them know the API is fine, 
but the movie they requested didnt exist.

- The caching should probably be configured with an actual TTL, but since we don't know if/when the actual source API 
ever updates. Should probably move to a specific cache provider where these can be configured instead of the default.

- The getMoviePriceResponseFromName() in the MovieService class could probably not throw an exception if either of the requests it makes fails
it could return a response object with the working response. This behavior may depend on the behavior of this requirement. i.e. should
we ever actually display a movie if we can only get a single price for it.

- The API key could be passed to a secrets manager and fetched

- Testing of the controller, it is currently un-tested (but also does not do very much - there is no bean validation or 
validation of any data being passed to the endpoints)
