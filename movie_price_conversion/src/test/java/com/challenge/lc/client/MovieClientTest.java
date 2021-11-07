package com.challenge.lc.client;

import com.challenge.lc.model.Movie;
import com.challenge.lc.model.MovieList;
import com.challenge.lc.model.PriceConversion;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;

import static com.challenge.lc.client.MovieClient.PRICE_CONVERSION_ENDPOINT;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(SpringExtension.class)
@RestClientTest(MovieClient.class)
class MovieClientTest {

    @Autowired
    private MovieClient movieClient;

    @Autowired
    private MockRestServiceServer mockRestServiceServer;

    @Test
    void test_500Response(){
        Exception exception = assertThrows(RestClientException.class, () -> {
            this.mockRestServiceServer
                    .expect(requestTo("https://challenge.moviechallenge.com.au/api/NOTREAL/movie/cw2488496"))
                    .andRespond(withServerError());
            movieClient.getMovieByIdAndProvider("cw2488496", "NOTREAL");
        });
        mockRestServiceServer.verify();
    }

    @Test
    void test_200ActualResponseSingleMovie() throws JsonProcessingException {
        String expectedAsString = "{\"ID\":\"cw2488496\",\"Title\":\"Star Wars: Episode VII - The Force Awakens\",\"Year\":\"2015\",\"Rated\":\"PG-13\",\"Released\":\"18 Dec 2015\",\"Runtime\":\"138 min\",\"Genre\":\"Action, Adventure, Sci-Fi\",\"Director\":\"J.J. Abrams\",\"Writer\":\"Lawrence Kasdan, J.J. Abrams, Michael Arndt, George Lucas (based on characters created by)\",\"Actors\":\"Harrison Ford, Mark Hamill, Carrie Fisher, Adam Driver\",\"Plot\":\"Three decades after the Empire's defeat, a new threat arises in the militant First Order. Defected stormtrooper Finn and the scavenger Rey are caught up in the Resistance's search for the missing Luke Skywalker.\",\"Language\":\"English\",\"Country\":\"USA\",\"Poster\":\"https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg\",\"Type\":\"movie\",\"Production\":\"Walt Disney Pictures\",\"Price\":25}";
        ObjectMapper objectMapper = new ObjectMapper();
        Movie expectedAsMovie = objectMapper.readValue(expectedAsString, Movie.class);
        this.mockRestServiceServer
                .expect(requestTo("https://challenge.moviechallenge.com.au/api/cinemaworld/movie/cw2488496"))
                .andRespond(withSuccess()
                .contentType(MediaType.APPLICATION_JSON)
                .body(expectedAsString));
        Movie movie = movieClient.getMovieByIdAndProvider("cw2488496", "cinemaworld");
        assertEquals(expectedAsMovie, movie);
        mockRestServiceServer.verify();
    }

    @Test
    void test_200ActualResponseMovieList() throws JsonProcessingException {
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
        this.mockRestServiceServer
                .expect(requestTo("https://challenge.moviechallenge.com.au/api/cinemaworld/movies"))
                .andRespond(withSuccess()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(expectedAsString));
        MovieList actual = movieClient.getMoviesByProvider("cinemaworld");
        assertEquals(expected, actual);
        mockRestServiceServer.verify();
    }

    @Test
    void test_canGetPriceConversionForUsdToAud() {

        this.mockRestServiceServer
                .expect(requestTo(PRICE_CONVERSION_ENDPOINT))
                .andRespond(withSuccess()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"base\":\"USD\",\"date\":\"2020-06-01\",\"rates\":{\"CAD\":\"1.260046\",\"AU\":\"1.44058\",\"EUR\":\"0.806942\",\"GBP\":\"0.719154\"}}"));
        PriceConversion priceConversion = movieClient.getPriceConversionForUsd();
        assertEquals(priceConversion.getBase(), "USD");
        assertEquals(priceConversion.getRates().getAu(), 1.44058);

    }

}