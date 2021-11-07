package com.challenge.lc.client;

import com.challenge.lc.model.Movie;
import com.challenge.lc.model.MovieList;
import com.challenge.lc.model.PriceConversion;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class MovieClient {

    private static final String MOVIE_API_ENDPOINT = "https://challenge.moviechallenge.com.au/api/";
    public static final String PRICE_CONVERSION_ENDPOINT = MOVIE_API_ENDPOINT + "exchangerate";
    private static final String MOVIE_API_KEY = "Yr2636E6BTD3UCdleMkf7UEdqKnd9n361TQL9An7";

    RestTemplate restTemplate;

    public MovieClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public Movie getMovieByIdAndProvider(String id, String provider) {
        ResponseEntity<Movie> movieResponseResponseEntity = restTemplate.exchange(MOVIE_API_ENDPOINT + provider + "/movie/" + id, HttpMethod.GET, new HttpEntity<Object>(generateHeaders()), Movie.class);
        return movieResponseResponseEntity.getBody();
    }

    public MovieList getMoviesByProvider(String provider) {
        ResponseEntity<MovieList> movieResponseResponseEntity = restTemplate.exchange(MOVIE_API_ENDPOINT + provider + "/movies" , HttpMethod.GET, new HttpEntity<Object>(generateHeaders()), MovieList.class);
        return movieResponseResponseEntity.getBody();
    }

    public PriceConversion getPriceConversionForUsd(){

        Price

        return null;
    }

    private MultiValueMap<String, String> generateHeaders() {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("x-api-key", MOVIE_API_KEY);
        headers.add("Content-Type", "application/json");
        return headers;
    }
}
