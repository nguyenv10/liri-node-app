'use strict';

require("dotenv").config();

var keys = require("./keys.js");
//required packages
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb;
var axios = require('axios');
var moment = require('moment');
var fs = require("fs");


function concert_this(param_name) {
    //requests the url for data
    axios.get("https://rest.bandsintown.com/artists/Maroon%205/events?app_id=codingbootcamp")
    .then(function (response) {
        var data = response.data
        for (var i=0; i<data.length; i++) {
            log_output("Venue: " + data[i].venue.name)
            log_output("Location: " + data[i].venue.city + ", " + data[i]
            .venue.country)
            var date = data[i].datetime
            log_output("Date: " + moment(date).format('MM/DD/YYYY'))
        }
    })
}

function spotify_song(song_name) {
    //default song
    if (!song_name) {
        song_name = "The Sign Ace of Base";
    }
    //searches for a particular song and returns the top most returned song 
    spotify.search({type: "track", query: song_name}, function(err, data) {
        if (err) {
            log_output(err);
        }

        var userSong = data.tracks.items;
        log_output("Artist: " + userSong[0].artists[0].name);
        log_output("Song Name: " + userSong[0].name);
        log_output("Preview Link: " + userSong[0].preview_url);
        log_output("Album: " + userSong[0].album.name);
    });
};

function movie(movie_name) {
    //default movie_name
    if (movie_name === undefined){
        console.log('If you haven\'t watched "Mr. Nobody", then you should: '
        + 'http://www.imdb.com/title/tt0485947/' + '\nIt\'s on Netflix!')
    }
    else {
        axios.get("http://www.omdbapi.com/?t=" + movie_name
        + "&apikey=" + omdb['key'])
        .then(function (response) {
        var data = response.data
        log_output("Title of the Movie: " + data["Title"])
        log_output("Year the Movie came out: " + data["Year"])
        log_output("IMDB Rating of the Movie: " + data["imdbRating"])
        var rate = data["Ratings"].find(r => r.Source === 'Rotten Tomatoes');
        log_output("Rotten Tomato Rating of the Movie: " + rate["Value"])
        log_output("Movie produced in the Country: " + data["Country"])
        log_output("Language of the Movie: " + data["Language"])
        log_output("Plot of the Movie: " + data["Plot"])
        log_output("Actors in the Movie: " + data["Actors"])
        })
    }
}
//reads text from random.txt and uses one of the function
function do_what() {
    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
            logThis(err);
        }

        var readArray = data.split(",");

        func = readArray[0];
        params = readArray[1];

        if (func === "concert-this") {
            concert_this(params)
        }
        else if (func === "spotify-this-song") {
            spotify_song(params)
        }
        else if (func === "movie-this") {
            movie(params)
        }
        else if (func === "do-what-it-says") {
            do_what()
        }
    })
}

//adds data to the log.txt file
function log_output(output) {

    console.log(output);

    fs.appendFile("log.txt", output, function(err) {
        if (err) {
            return log_output("Error: " + err);
        }
    });
};

//processes the command line argument
var func = process.argv[2]
var params = process.argv[3]


if (func === "concert-this") {
    concert_this(params)
}
else if (func === "spotify-this-song") {
    spotify_song(params)
}
else if (func === "movie-this") {
    movie(params)
}
else if (func === "do-what-it-says") {
    do_what()
}
else {
    console.log("Please enter a valid command: " +
    "\n\tconcert-this\n\tspotify-this-song\n\tmovie-this\n\tdo-what-it-says")
}

