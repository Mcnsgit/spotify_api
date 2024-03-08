require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const qs = require('qs');


const app = express();

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REACT_APP_REDIRECT_URI,
        clientId: process.env.REACT_APP_CLIENT_ID,
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    });

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        });
    }).catch(err => {
      console.error(err);
      res.status(400).json({ error: 'An error occurred during authentication.' });
    });
  });

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REACT_APP_REDIRECT_URI,
        clientId: process.env.REACT_APP_CLIENT_ID,
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
        refreshToken,
    });

    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in,
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(400).json({ error: 'An error occurred during refreshing access token.' });
    });
});

// app.get('/callback', async (req, res) => {
//     const code = req.query.code;
//     const redirect_uri = process.env.REDIRECT_URI; // Your redirect URI
//     const client_id = process.env.CLIENT_ID; // Your Spotify Client ID
//     const client_secret = process.env.CLIENT_SECRET; // Your Spotify Client Secret

//     try {
//         const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
//             grant_type: 'authorization_code',
//             code: code,
//             redirect_uri: redirect_uri,
//             client_id: client_id,
//             client_secret: client_secret,
//         }), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//         });

//         const { access_token, refresh_token, expires_in } = response.data;

//         // Redirect or send the tokens to the client to make further API requests
//         res.redirect(`/your-client-route?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`);
//     } catch (error) {
//         console.error('Error exchanging auth code for tokens:', error.response.data);
//         res.status(500).send('Internal Server Error');
//     }
// });
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  const client_id = process.env.REACT_APP_CLIENT_ID;
  const client_secret = process.env.REACT_APP_CLIENT_SECRET;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
      client_id: client_id,
      client_secret: client_secret,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Store the refresh token in the session
    req.session.refreshToken = refresh_token;

    // Send the tokens and expiration time to the client
    res.json({ access_token, refresh_token, expires_in });
  } catch (error) {
    console.error('Error exchanging auth code for tokens:', error.response.data);
    res.status(500).send('Internal Server Error');
  }
});
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});