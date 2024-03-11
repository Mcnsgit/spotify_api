require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const qs = require('qs');


const app = express();

console.log('Server configuration loaded');

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    const code = req.body.code;
    console.log(`Received code: ${code}`);
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REACT_APP_REDIRECT_URI,
        clientId: process.env.REACT_APP_CLIENT_ID,
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    });

    spotifyApi.authorizationCodeGrant(code).then(data => {
        console.log('Authentication successful');
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        });
    }).catch(err => {
      console.error('Error during authentication', err);
      res.status(400).json({ error: 'An error occurred during authentication.' });
    });
  });

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log(`Received refresh token: ${refreshToken}`);
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REACT_APP_REDIRECT_URI,
        clientId: process.env.REACT_APP_CLIENT_ID,
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
        refreshToken,
    });

    spotifyApi.refreshAccessToken().then(data => {
        console.log('Refresh successful');
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in,
        });
    }).catch(err => {
        console.log('Error during refreshing access token', err);
        res.sendStatus(400).json({ error: 'An error occurred during refreshing access token.' });
    });
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log(`Received code: ${code}`);
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
    console.log('Exchange successful');
    res.json({ access_token, refresh_token, expires_in });
  } catch (error) {
    console.error('Error exchanging auth code for tokens:', error.response.data);
    res.status(500).send('Internal Server Error');
  }
});
const port = process.env.PORT || 3001;
console.log(`Server listening on port ${port}`);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
