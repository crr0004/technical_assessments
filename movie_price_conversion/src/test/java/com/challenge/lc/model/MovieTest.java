package com.challenge.lc.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MovieTest {

    @Test
    void test_deserialseFromJson() throws JsonProcessingException {
        Movie expected = new Movie("cw2488496","Star Wars: Episode VII - The Force Awakens", "2015", "PG-13", "18 Dec 2015", "138 min", "Action, Adventure, Sci-Fi","J.J. Abrams", "Lawrence Kasdan, J.J. Abrams, Michael Arndt, George Lucas (based on characters created by)", "Harrison Ford, Mark Hamill, Carrie Fisher, Adam Driver", "Three decades after the Empire's defeat, a new threat arises in the militant First Order. Defected stormtrooper Finn and the scavenger Rey are caught up in the Resistance's search for the missing Luke Skywalker.", "English", "USA", "https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg", "movie", "Walt Disney Pictures", 25.00 );
        ObjectMapper objectMapper = new ObjectMapper();
        String expectedAsString = "{\"ID\":\"cw2488496\",\"Title\":\"Star Wars: Episode VII - The Force Awakens\",\"Year\":\"2015\",\"Rated\":\"PG-13\",\"Released\":\"18 Dec 2015\",\"Runtime\":\"138 min\",\"Genre\":\"Action, Adventure, Sci-Fi\",\"Director\":\"J.J. Abrams\",\"Writer\":\"Lawrence Kasdan, J.J. Abrams, Michael Arndt, George Lucas (based on characters created by)\",\"Actors\":\"Harrison Ford, Mark Hamill, Carrie Fisher, Adam Driver\",\"Plot\":\"Three decades after the Empire's defeat, a new threat arises in the militant First Order. Defected stormtrooper Finn and the scavenger Rey are caught up in the Resistance's search for the missing Luke Skywalker.\",\"Language\":\"English\",\"Country\":\"USA\",\"Poster\":\"https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg\",\"Type\":\"movie\",\"Production\":\"Walt Disney Pictures\",\"Price\":25}";
        Movie actual = objectMapper.readValue(expectedAsString, Movie.class);
        assertEquals(expected, actual);
    }

}