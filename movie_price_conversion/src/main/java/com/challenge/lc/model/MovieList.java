package com.challenge.lc.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Objects;

public class MovieList {
    @JsonProperty("Provider")
    private String provider;

    @JsonProperty("Movies")
    private List<Movie> movies;

    public MovieList() {
    }

    public MovieList(String provider, List<Movie> movies) {
        this.provider = provider;
        this.movies = movies;
    }

    @JsonProperty("Provider")
    public String getProvider() {
        return provider;
    }

    @JsonProperty("Provider")
    public void setProvider(String provider) {
        this.provider = provider;
    }

    @JsonProperty("Movies")
    public List<Movie> getMovies() {
        return movies;
    }

    @JsonProperty("Movies")
    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MovieList movieList = (MovieList) o;
        return Objects.equals(provider, movieList.provider) &&
                Objects.equals(movies, movieList.movies);
    }

    @Override
    public int hashCode() {
        return Objects.hash(provider, movies);
    }
}
