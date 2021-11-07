package com.challenge.lc.model;

public class MoviePriceResponse {
    Movie filmWorldMovie;
    Movie cinemaWorldMovie;

    public MoviePriceResponse(Movie filmWorldMovie, Movie cinemaWorldMovie) {
        this.filmWorldMovie = filmWorldMovie;
        this.cinemaWorldMovie = cinemaWorldMovie;
    }

    public Movie getFilmWorldMovie() {
        return filmWorldMovie;
    }

    public void setFilmWorldMovie(Movie filmWorldMovie) {
        this.filmWorldMovie = filmWorldMovie;
    }

    public Movie getCinemaWorldMovie() {
        return cinemaWorldMovie;
    }

    public void setCinemaWorldMovie(Movie cinemaWorldMovie) {
        this.cinemaWorldMovie = cinemaWorldMovie;
    }
}
