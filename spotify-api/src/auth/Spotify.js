// // import axios from "axios";
// // import qs from 'qs';
// import axios from "axios";
// import qs from 'qs';
// import { BASE_URL } from '../utils/constants';

// export const fetchUserProfile = async () => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (!accessToken) {
//         console.error('Access Token is not available.');
//         return;
//     }
//     const userId = localStorage.getItem('userId');
//     if (!userId) {
//         console.error('User ID is not available.');
//         return;
//     }
//     try {
//         const response = await axios.get(`${BASE_URL}/users/${userId}`, {

//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json',
//             }
//         });
//         console.log('User Profile:', response.data);
//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             console.error('Access Token expired. Fetching new access token...');
//             const refreshToken = localStorage.getItem('refreshToken');
//             const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
//                 grant_type: 'refresh_token',
//                 refresh_token: refreshToken,
//             }), {
//                 headers: {
//                     'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             });
//             const { access_token } = response.data;
//             localStorage.setItem('accessToken', access_token);
//             return fetchUserProfile();

//         } else {
//             console.error('Error fetching user profile:', error);
//         }
//     }
// };

// // const clientId ="1f42356ed83f46cc9ffd35c525fc8541";
// // const redirectUri = "process.env.REDIRECT_URI";
// // const scope = [
// //     "user-read-currently-playing",
// //     "user-read-recently-played",
// //     "user-read-playback-state",
// //     "user-top-read",
// //     "user-modify-playback-state",
// // ];

// // export default function authUrl() {
// //     const params = new URLSearchParams({
// //       response_type: 'code',
// //       client_id: clientId,
// //       scope: scope.join(' '),
// //       redirect_uri: redirectUri,
// //     });
  
// //     return `https://accounts.spotify.com/authorize?${params.toString()}`;
// //   }

// // const authEndPoint = "https://accounts.spotify.com/authorize";

// // const generateRandomString = (length) => {
// //     var codeVerifier = '';
// //     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// //     var charactersLength = characters.length;
// //     for (var i = 0; i < length; i++) {
// //         codeVerifier += characters.charAt(Math.floor(Math.random() * charactersLength));
// //     }
// //     return codeVerifier;
// // }
// // export const login = (req, res) => {
// //     // Clear any existing tokens from the session.
// //     req.session.token = '';
// //     var state = generateRandomString(16);
// //     const stateKey = 'spotify_auth_state';
// //     res.cookie(stateKey, state);
// //     res.redirect(authUrl() + '&state=' + state);
// //   }
 

// // async function getProfile(accessToken) {
    
// //     const response = await axios.get('https://api.spotify.com/v1/me', {
// //         headers: {
// //             Authorization: `Bearer ${accessToken}`
// //         }
// //     });
// //     const data = response.data;
// //     console.log(data);
// //     return data
// // }
// // getProfile();

// // export const fetchUserProfile = async (accessToken) => {
// //   try {
// //     const response = await axios.get('https://api.spotify.com/v1/me', {
// //       headers: {
// //         'Authorization': `Bearer ${accessToken}`,
// //         'Content-Type': 'application/json',
// //       }
// //     });
// //     console.log('User Profile:', response.data);
// //     return response.data;
// //   } catch (error) {
// //     if (error.response && error.response.status === 401) {
// //       console.error('Access Token expired. Fetching new access token...');
// //       const refreshToken = localStorage.getItem('refreshToken');
// //       // Call the refreshToken function to get a new access token
// //       await refreshToken();
// //       // Try fetching the user profile again with the new access token
// //       return fetchUserProfile(localStorage.getItem('accessToken'));
// //     } else {
// //       console.error('Error fetching user profile:', error);
// //     }
// //   }
// // };