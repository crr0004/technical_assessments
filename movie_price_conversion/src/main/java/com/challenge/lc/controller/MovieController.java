package com.challenge.lc.controller;

import com.challenge.lc.model.Movie;
import com.challenge.lc.model.MovieList;
import com.challenge.lc.model.MoviePriceResponse;
import com.challenge.lc.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class MovieController {

    private MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/movie/{provider}/{id}")
    @CrossOrigin
    public ResponseEntity<Movie> getMovieByProviderAndId(@PathVariable String provider, @PathVariable String id){
        return ResponseEntity.ok(movieService.getMovieByIdAndProvider(id, provider));
    }

    @GetMapping("/movie")
    @CrossOrigin
    public ResponseEntity<MoviePriceResponse> getMoviesByName(@RequestParam String name){
        return ResponseEntity.ok(movieService.getMoviePriceResponseFromName(name));
    }

    @GetMapping("/movies/{provider}")
    @CrossOrigin
    public ResponseEntity<MovieList> getListOfMoviesByProvider(@PathVariable String provider){
        return ResponseEntity.ok(movieService.getListOfMoviesFromProvider(provider));
    }
}
