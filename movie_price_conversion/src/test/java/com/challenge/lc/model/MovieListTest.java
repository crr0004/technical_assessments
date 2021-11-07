package com.challenge.lc.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MovieListTest {
    @Test
    void test_deserialiseFromJson() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Movie> expectedMovies = new ArrayList<>();
        expectedMovies.add(new Movie("fw2488496", "Star Wars: Episode VII - The Force Awakens", "movie", "https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg"));
        MovieList expected = new MovieList("Film World", expectedMovies);

        String expectedAsString = "{\n" +
                "    \"Provider\": \"Film World\",\n" +
                "    \"Movies\": [\n" +
                "        {\n" +
                "            \"ID\": \"fw2488496\",\n" +
                "            \"Title\": \"Star Wars: Episode VII - The Force Awakens\",\n" +
                "            \"Type\": \"movie\",\n" +
                "            \"Poster\": \"https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg\"\n" +
                "        }\n" +
                "     ]\n" +
                "}";

        MovieList actual = objectMapper.readValue(expectedAsString, MovieList.class);
        assertEquals(expected, actual);
    }
}