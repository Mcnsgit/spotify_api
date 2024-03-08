// App.js
import React, { useEffect, useState } from 'react';
import Dashboard from './components/dashboard';
import Login from './login';
import useSpotifyApi from './auth/useSpotifyApi';
import SpotifyPlayer from './components/searchComponent.js';
import { SpotifyPlayerProvider } from './components/spotifyPlayerContex.js';

const App = () => {
  
  const accessToken = localStorage.getItem('accessToken');
  const { callApi } = useSpotifyApi();
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (token) {
      callApi('me').then(data => {
        if (!data) {
          setToken(null);
          localStorage.removeItem('accessToken');
        }
      });
    }
  }, [callApi, token]);

  return (
    <div className="App">
      {token ? <Dashboard /> : <Login />}
      <SpotifyPlayerProvider accessToken={accessToken}>
        {accessToken && <SpotifyPlayer accessToken={accessToken} />}
      </SpotifyPlayerProvider>
    </div>
  );
};

export default App;
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Dashboard from './components/dashboard';
// import Login from './login';
// // import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
// import { useState, useEffect } from 'react';

// import './App.css';

// // function App() {
// //     const [token, setToken] = useState(null);
// //     const [searchInput, setSearchInput] = useState('');
// //     const [accessToken, setAccessToken] = useState('');
// //     const [searchResults, setSearchResults] = useState([]);
//     function App() {
//         const [token, setToken] = useState(null);
      
//         useEffect(() => {
//           const urlParams = new URLSearchParams(window.location.search);
//           const code = urlParams.get('code');
      
//           if (code) {
//             // Exchange the authorization code for an access token and refresh token
//             fetch('/callback', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ code }),
//             })
//               .then((response) => response.json())
//               .then((data) => {
//                 const { access_token, refresh_token, expires_in } = data;
//                 localStorage.setItem('accessToken', access_token);
//                 localStorage.setItem('refreshToken', refresh_token);
//                 localStorage.setItem('expirationTime', new Date().getTime() + expires_in * 1000);
//                 setToken(access_token);
//               })
//               .catch((error) => {
//                 console.error('Error:', error);
//               });
//           }
//         }, []);
      
//         return <div className="App">{token ? <Dashboard token={token} /> : <Login />}</div>;
//       }
      
//       export default App;
//     // const fetchToken = async () => {
//     //     // Fetch the token from your backend
//     //     const response = await fetch('/login');
//     //     const data = await response.json();
//     //     setAccessToken(data.access_token);
//     // };

//     // const searchArtists = async () => {
//     //     if (!searchInput.trim()) return;
//     //     const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=artist`;
//     //     const response = await fetch(endpoint, {
//     //         headers: {
//     //             Authorization: `Bearer ${accessToken}`,
//     //             'Content-Type': 'application/json',
//     //         },
//     //     });
//     //     const data = await response.json();
//     //     console.log(data); // Process and set to state
//     //     setSearchResults(data.artists.items);
//     // };

//     // useState(() => {
//     //     fetchToken();
//     // }, []);

// //     return (
// //         <div className="App">
// //             <Container>
// //                 <InputGroup className="mb-3" size="lg">
// //                     <FormControl
// //                         placeholder="Search For Artist"
// //                         onChange={(e) => setSearchInput(e.target.value)}
// //                         onKeyDown={(event) => event.key === "Enter" && searchArtists()}
// //                     />
// //                     <Button onClick={searchArtists}>Search</Button>
// //                 </InputGroup>
// //             </Container>
// //             <Container>
// //                 <Row className="mx-2 row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
// //                     {searchResults.map((artist) => (
// //                         <Card key={artist.id}>
// //                             <Card.Img variant="top" src={artist.images[0]?.url || ''} />
// //                             <Card.Body>
// //                                 <Card.Title>{artist.name}</Card.Title>
// //                             </Card.Body>
// //                         </Card>
// //                     ))}
// //                 </Row>
// //             </Container>
// //         </div>
// //     );
// // }

// // export default App;

// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
// // import { useState, useEffect } from 'react';

// // import './App.css';
// // const client_id = "1f42356ed83f46cc9ffd35c525fc8541";
// // const client_secret = "0b524c44f9404b808cabd354d04df737";


// // function App() {
// //   const [searchInput, setSearchInput] = useState('');
// //   const [accessToken, setAccessToken] = useState('');
// //   const [albums, setAlbums] = useState([]);
// //   // const [searchResults, setSearchResults] = useState([]);

// //   useEffect(() => {
// //     var authParameters = {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/x-www-form-urlencoded",
// //         "Authorization": "Basic " + btoa(client_id + ":" + client_secret)
// //       },
// //       body: "grant_type=client_credentials&client_id=" + client_id + "&client_secret=" + client_secret
// //     }


// //     fetch("https://accounts.spotify.com/api/token", authParameters)
// //       .then(result => result.json())
// //       .then(data => setAccessToken(data.access_token))
// //   }, [])

// //   async function search() {
// //     console.log('Searching for ' + searchInput);

// //     var searchParameters = {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //         "Authorization": "Bearer " + accessToken
// //       }
// //     }

// //     var artistID = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist", searchParameters)
// //       .then(response => response.json())
// //       .then(data => { return data.artists.items[0].id })

// //     console.log("Artist ID: " + artistID);

// //     var returnedAlbums = await fetch('https://api.spotify.com/v1/artits/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
// //     .then (response =>response.json())
// //     .then (data => {
// //       console.log(data);
// //       setAlbums(data.items);
// //     }) 
    
// //   }
// //   console.log(albums);
// //   return (
// //     <div className="App">
// //       <Container>
// //         <InputGroup className="mb-3" size="lg">
// //           <FormControl
// //             placeholder="Search For Artist"
// //             type="input"
// //             onKeyDown={event => {
// //               if (event.key == "Enter") {
// //                 search();
// //               }
// //             }}
// //             onChange={event =>
// //               setSearchInput(event.target.value)}
// //             />
// //           <Button onClick={search}>
// //             Search</Button>
// //         </InputGroup>
// //       </Container>
// //       <Container>
// //         <Row className="mx-2 row row-cols-4">
// //           {albums.map( (album, i) => {
// //             console.log(album);
// //             return(
// //             <Card>
// //               <Card.Img src={album.images[0].url} />
// //               <Card.Body>
// //                 <Card.Title>{album.name}</Card.Title>
// //               </Card.Body>
// //             </Card>
// //             )
// //           })}
// //         </Row>
// //       </Container>
// //     </div>
// //   );
// // }


// // export default App;

