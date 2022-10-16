var express = require('express');
var axios = require('axios')
var querystring = require('querystring');
var router = express.Router();
var client_id = 'c265e177c1dc4c0ea41d61d0100a74c3'; // Your client id
var client_secret = '812aff82b88e49cfb102836db57ca289'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
var stateKey = 'spotify_auth_state';


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


router.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state user-read-currently-playing';
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`);
});

router.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    }
  }).then(data => {
    var access_token = data.access_token

    return res.send({
      'access_token': access_token
    })
  })
});

router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    return res.redirect('/?error=state_mismatch');
  } else {
    res.clearCookie(stateKey);
    let form = {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    }

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify(form),
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      // console.log('data', response)
      var access_token = response.data.access_token,
          refresh_token = response.data.refresh_token;

      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }).then(data => {
        console.log(data)
      })

      return res.redirect(`http://localhost:3000/?access_token=${access_token}&refresh_token=${refresh_token}`)
    }).catch(err => {
      console.log(err)
      return res.redirect('http://localhost:3000/login?error=invalid_token')
    })
  }
});

router.get('/playing', (req, res) => {
  let access_token = req.query.access_token

  axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    // console.log('response', response.status)

    if(response.status == 204) {
      return res.json({
        message: 'Not playing'
      })
    } 

    if(response.error) {
      return res.json({error: response.data.error.message})
    }

    return res.send(response.data)
  }).catch(err => {
    if(err.response.status === 401) {
      res.send({message: 'Token Expired'})
    }
  })
})

router.get('/next', (req, res) => {
  let access_token = req.query.access_token

  axios({
    method: 'post',
    url: 'https://api.spotify.com/v1/me/player/next',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    }
  }).then(() => {
    return res.send(200)
  }).catch(err => {
    return res.send(err).append(502)
  })
})

router.get('/previous', (req, res) => {
  let access_token = req.query.access_token

  axios({
    method: 'post',
    url: 'https://api.spotify.com/v1/me/player/previous',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    }
  }).then(() => {
    return res.send(200)
  }).catch(err => {
    return res.send(err).append(502)
  })
})

router.get('/play', (req, res) => {
  let access_token = req.query.access_token

  axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    }
  }).then(() => {
    return res.send(200)
  }).catch(err => {
    return res.send(err).append(502)
  })
})

router.get('/pause', (req, res) => {
  let access_token = req.query.access_token

  axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    }
  }).then(() => {
    return res.send(200)
  }).catch(err => {
    return res.send(err)
  })
})

module.exports = router;
