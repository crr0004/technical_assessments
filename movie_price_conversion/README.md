# Problem statement requirements

Not long after the movie price comparison has gone into production Prince's Theatre start to get complaints. Customers are saying that the Filmworld prices are not correct.
After some investigation Travis realises that Filmworld's prices are in USD not AUD like their users are expecting.
There is an endpoint that can be used for seeing the price of USD relative to other currencies : https://challenge.moviechallenge.com.au/api/exchangerate/usd

We must make the necessary changes to convert Filmworld's prices into AUD so that both are shown in the same currency.

endpoint: https://challenge.moviechallenge.com.au/api/exchangerate/usd

Format: {"base":"USD","date":"2020-06-01","rates":{"CAD":"1.260046","AU":"1.44058","EUR":"0.806942","GBP":"0.719154"}}

# Notes
This challenge was live coding to change adapt the FilmWorld movies to convert from USD. I did not complete the code however was enough to pass the challenge.

I was following TDD and getting the core logic working before I changed any of the client requests.