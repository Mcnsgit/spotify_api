// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
// // import { useState } from 'react';

// // import './App.css';

// // function App() {
// //     const [searchInput, setSearchInput] = useState('');
// //     const [accessToken, setAccessToken] = useState('');
// //     const [searchResults, setSearchResults] = useState([]);

// //     const fetchToken = async () => {
// //         // Fetch the token from your backend
// //         const response = await fetch('/login');
// //         const data = await response.json();
// //         setAccessToken(data.access_token);
// //     };

// //     const searchArtists = async () => {
// //         if (!searchInput.trim()) return;
// //         const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=artist`;
// //         const response = await fetch(endpoint, {
// //             headers: {
// //                 Authorization: `Bearer ${accessToken}`,
// //                 'Content-Type': 'application/json',
// //             },
// //         });
// //         const data = await response.json();
// //         console.log(data); // Process and set to state
// //         setSearchResults(data.artists.items);
// //     };

// //     useState(() => {
// //         fetchToken();
// //     }, []);

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
// import React, { useEffect, useState, useCallback } from 'react';
// import Login from './login';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import qs from 'querystring';
// import { fetchUserProfile } from './auth/Spotify';
// import Dashboard from './components/dashboard';


// const clientId = '1f42356ed83f46cc9ffd35c525fc8541';
// const clientSecret = '0b524c44f9404b808cabd354d04df737';

// function App() {
//   const [token, setToken] = useState(null);
//   const [accessToken, setAccessToken] = useState('');

//   useEffect(() => {
//     const fetchToken = async () => {
//       const response = await fetch('/login');
//       const data = await response.json();
//       setAccessToken(data.access_token);
//     };
//     fetchToken();
//       const refreshToken = async () => {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           console.error('Refresh Token is not available.');
//           // Logic to handle missing refresh token
//           return;
//         }
//       }
//       const expirationTime = async () =>{
//         const expirationTime = localStorage.getItem('expirationTime');
//         if (!accessToken || !expirationTime || new Date().getTime() > Number(expirationTime)) {
//             refreshToken();
//             } else {
//             setToken(accessToken);
//             fetchUserProfile(accessToken);
//         }   
//     } 
//     expirationTime();
//     }, []);

//   const redirectToLogin = () => {
//     window.location.href = '/login';
//   };
//   const clearToken = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('expirationTime');
//     setToken(null);
//   };

//   const refreshToken = useCallback(async () => {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//       console.error('Refresh Token is not available.');
//       // Logic to handle missing refresh token
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'https://accounts.spotify.com/api/token',
//         qs.stringify({
//           grant_type: 'refresh_token',
//           refresh_token: refreshToken,
//         }),
//         {
//           headers: {
//             'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         }
//       );


//       const { access_token, expires_in } = response.data;
//       const expirationTime = new Date().getTime() + expires_in * 1000;

//       localStorage.setItem('accessToken', access_token);
//       localStorage.setItem('expirationTime', expirationTime.toString());

//       setToken(access_token);
//     } catch (error) {
//       console.error('Error refreshing token:', error);
//       redirectToLogin();
//     }
//  }, []);

//   return <div className="App">{token ? <Dashboard token={token} /> : <Login />}</div>;
// }

// export default App;