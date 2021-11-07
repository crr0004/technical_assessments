package com.challenge.lc.service;

import com.challenge.lc.client.MovieClient;
import com.challenge.lc.model.Movie;
import com.challenge.lc.model.MovieList;
import com.challenge.lc.model.MoviePriceResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.SimpleKey;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class MovieServiceTest {

    @Autowired
    CacheManager cacheManager;

    @Autowired
    MovieService movieService;

    @MockBean
    MovieClient movieClient;

    @BeforeEach
    void cleanMock(){
        Mockito.reset(movieClient);
    }

    @AfterEach
    void resetMocks(){
        Mockito.reset(movieClient);
    }

    @Test
    void test_firstMovieListCallAddsToCache(){
        List<Movie> expectedMovies = new ArrayList<>();
        expectedMovies.add(new Movie("fw2488496", "Star Wars: Episode VII - The Force Awakens", "movie", "https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg"));
        MovieList expected = new MovieList("Film World", expectedMovies);
        when(movieClient.getMoviesByProvider("filmworld")).thenReturn(expected);
        assertNull(getFromMovieListCacheByName("movieList", "filmworld"));
        MovieList actual = movieService.getListOfMoviesFromProvider("filmworld");
        assertEquals(actual, getFromMovieListCacheByName("movieList", "filmworld"));

    }

    @Test
    void test_firstMovieCallAddsToCache() {
        Movie m1 = new Movie();
        m1.setId("id1");
        m1.setTitle("My Movie");
        m1.setPrice(25.5);
        m1.setPoster("My Poster");
        when(movieClient.getMovieByIdAndProvider("id1", "filmworld")).thenReturn(m1);

        SimpleKey simpleKey = new SimpleKey("id1", "filmworld");

        assertNull(getFromMovieCacheBySimpleKey("movie",simpleKey));
        Movie actual = movieService.getMovieByIdAndProvider("id1", "filmworld");
        assertEquals(actual, getFromMovieCacheBySimpleKey("movie",simpleKey));
    }

    @Test
    void test_firstNamedMovieCallAddsToCache(){
        Movie m1 = new Movie();
        m1.setId("id1");
        m1.setTitle("My Movie");
        m1.setPrice(25.5); // USD
        m1.setPoster("My Poster");

        Movie m2 = new Movie();
        m2.setId("id1");
        m2.setTitle("My Movie");
        m2.setPrice(35.5); // USD
        m2.setPoster("My Poster");

        MoviePriceResponse moviePriceResponse = new MoviePriceResponse(m1, m2);

        List<Movie> expectedFilmWorldMovies = new ArrayList<>();
        expectedFilmWorldMovies.add(m1);
        MovieList expectedFilmWorldMovieList = new MovieList("Film World", expectedFilmWorldMovies);

        List<Movie> expectedCinemaWorldMovies = new ArrayList<>();
        expectedCinemaWorldMovies.add(m2);
        MovieList expectedCinemaWorldMoviesList = new MovieList("Cinema World", expectedCinemaWorldMovies);

        when(movieClient.getMoviesByProvider("cinemaworld")).thenReturn(expectedCinemaWorldMoviesList);
        when(movieClient.getMoviesByProvider("filmworld")).thenReturn(expectedFilmWorldMovieList);

        when(movieClient.getMovieByIdAndProvider("id1", "filmworld")).thenReturn(m1);
        when(movieClient.getMovieByIdAndProvider("id1", "cinemaworld")).thenReturn(m2);


        assertNull(getFromMoviePriceCacheByName("movieTitle", "My Movie"));
        MoviePriceResponse mpr = movieService.getMoviePriceResponseFromName("My Movie");
        assertEquals(mpr, getFromMoviePriceCacheByName("movieTitle", "My Movie"));

    }

    @Test
    void test_priceConversionHappensForFilmworld(){

        final double priceInAud = 27;
        final double priceInUsd = 25.5;

        Movie m1 = new Movie();
        m1.setId("id1");
        m1.setTitle("My Movie");
        m1.setPrice(priceInUsd); // USD
        m1.setPoster("My Poster");

        Movie m2 = new Movie();
        m2.setId("id1");
        m2.setTitle("My Movie");
        m2.setPrice(35.5); // AUD
        m2.setPoster("My Poster");

        MoviePriceResponse moviePriceResponse = new MoviePriceResponse(m1, m2);

        List<Movie> expectedFilmWorldMovies = new ArrayList<>();
        expectedFilmWorldMovies.add(m1);
        MovieList expectedFilmWorldMovieList = new MovieList("Film World", expectedFilmWorldMovies);

        List<Movie> expectedCinemaWorldMovies = new ArrayList<>();
        expectedCinemaWorldMovies.add(m2);
        MovieList expectedCinemaWorldMoviesList = new MovieList("Cinema World", expectedCinemaWorldMovies);

        when(movieClient.getMoviesByProvider("cinemaworld")).thenReturn(expectedCinemaWorldMoviesList);
        when(movieClient.getMoviesByProvider("filmworld")).thenReturn(expectedFilmWorldMovieList);

        when(movieClient.getMovieByIdAndProvider("id1", "filmworld")).thenReturn(m1);
        when(movieClient.getMovieByIdAndProvider("id1", "cinemaworld")).thenReturn(m2);


        assertNull(getFromMoviePriceCacheByName("movieTitle", "My Movie"));
        MoviePriceResponse mpr = movieService.getMoviePriceResponseFromName("My Movie");

        assertEquals(mpr.getFilmWorldMovie().getPrice(), priceInAud);


    }

    @Test
    void test_failedMovieResponseReturnsEventually() {
        List<Movie> expectedMovies = new ArrayList<>();
        expectedMovies.add(new Movie("fw2488496", "Star Wars: Episode VII - The Force Awakens", "movie", "https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg"));
        MovieList expected = new MovieList("Film World", expectedMovies);

        when(movieClient.getMoviesByProvider(any()))
                .thenThrow(RestClientException.class)
                .thenThrow(RestClientException.class)
                .thenReturn(expected);
        movieService.getListOfMoviesFromProvider("TEST");
        verify(movieClient, times(3)).getMoviesByProvider(any());
    }

    @Test
    void test_failedMovieResponseReturnsException() {
        Exception exception = assertThrows(RestClientException.class, () -> {
            List<Movie> expectedMovies = new ArrayList<>();
            expectedMovies.add(new Movie("fw2488496", "Star Wars: Episode VII - The Force Awakens", "movie", "https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg"));
            MovieList expected = new MovieList("Film World", expectedMovies);
            when(movieClient.getMoviesByProvider(any()))
                    .thenThrow(RestClientException.class)
                    .thenThrow(RestClientException.class)
                    .thenThrow(RestClientException.class);
            movieService.getListOfMoviesFromProvider("TEST");
        });
        verify(movieClient, times(3)).getMoviesByProvider(any());

    }



    private MovieList getFromMovieListCacheByName(String cachename, String cacheItemName){
        return cacheManager.getCache(cachename).get(cacheItemName, MovieList.class);
    }

    private Movie getFromMovieCacheBySimpleKey(String cachename, SimpleKey simpleKey){
        return cacheManager.getCache(cachename).get(simpleKey, Movie.class);
    }

    private MoviePriceResponse getFromMoviePriceCacheByName(String cacheName, String cacheItemName) {
        return cacheManager.getCache(cacheName).get(cacheItemName, MoviePriceResponse.class);
    }

}