package com.challenge.lc.service;

import com.challenge.lc.client.MovieClient;
import com.challenge.lc.model.Movie;
import com.challenge.lc.model.MovieList;
import com.challenge.lc.model.MoviePriceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

@Service
public class MovieService {

    MovieClient movieClient;

    Logger logger = LoggerFactory.getLogger(MovieService.class);

    public MovieService(MovieClient movieClient) {
        this.movieClient = movieClient;
    }

    @Retryable(value = RuntimeException.class)
    @Cacheable(value = "movieList")
    public MovieList getListOfMoviesFromProvider(String provider){
        return movieClient.getMoviesByProvider(provider);
    }

    @Retryable(value = RuntimeException.class)
    @Cacheable(value = "movie")
    public Movie getMovieByIdAndProvider(String id, String provider){
        return movieClient.getMovieByIdAndProvider(id, provider);
    }

    @Retryable(value = RuntimeException.class)
    @Cacheable(value = "usdToAud")
    public double getUsdToAudConversionrate(){

        return 0.0;
    }

    @Retryable(value = RuntimeException.class)
    @Cacheable(value = "movieTitle")
    public MoviePriceResponse getMoviePriceResponseFromName(String name){
        // Its possible both of these could return null, probably should change this to throw a specific exception if that happens
        MovieList fm = movieClient.getMoviesByProvider("filmworld");
        Movie filmWorldMovie = movieClient.getMoviesByProvider("filmworld").getMovies()
                .stream()
                .filter((movieResponse -> movieResponse.getTitle().equals(name)))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException());
        filmWorldMovie = movieClient.getMovieByIdAndProvider(filmWorldMovie.getId(), "filmworld");

        Movie cinemaWorldMovie = movieClient.getMoviesByProvider("cinemaworld").getMovies()
                .stream()
                .filter((movieResponse -> movieResponse.getTitle().equals(name)))
                .findFirst().orElseThrow(() -> new IllegalArgumentException());
        cinemaWorldMovie = movieClient.getMovieByIdAndProvider(cinemaWorldMovie.getId(), "cinemaworld");

        return new MoviePriceResponse(filmWorldMovie, cinemaWorldMovie);
    }
}
