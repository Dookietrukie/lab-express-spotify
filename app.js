require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
    })
    .catch(error => {
        console.log(`Something went wrong when retrieving an access token`, error)
    });

// ROUTES:

// GET / (home directory)
app.get('/', (req, res, next) => {
    res.render('home')
});

// GET /artist-search
app.get('/artist-search', (req, res, next) => {

    const artist = req.query.artistName;

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artist = data.body.artists.items;
            res.render('artist-search-result', {artist})
        })
        .catch(e => {
            console.log(`Found an error trying to search for artists: ${e}`);
        });
});

// GET /albums
app.get('/albums/:artistId', (req, res, next) => {

    const retreivedArtistId = req.params.artistId;

    spotifyApi
        .getArtistAlbums(retreivedArtistId)
        .then(data => {
            const album = data.body.items;
            res.render('albums', {album})
        })
        .catch(e => {
            console.log(`Found an error finding the specific album: ${e}`)
        });
});

// GET /tracks
app.get('/tracks/:albumId', (req, res, next) => {

    const retreivedAlbumId = req.params.albumId;

    spotifyApi
        .getAlbumTracks(retreivedAlbumId)
        .then(data => {
            const track = data.body.items;
            res.render('album-tracks', {track});
        })
        .catch(e => {
            console.log(`Found an error finding the tracks of the album: ${e}`)
        });

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));