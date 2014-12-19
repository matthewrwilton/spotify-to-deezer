
var util = require('util');
var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var apiSecrets = require('./lib/api-secrets.js');

var stateKey = 'spotify_auth_state';
var redirect_uri = 'http://localhost:8888/callback';

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

var isBadResponse = function(error, responseStatusCode) {

	if (error || responseStatusCode != 200) {
		console.error('error: %j' + error);
		console.error('response.statusCode: %d' + response.statusCode);
		return true;
	}
	
	return false;
};

var app = express();

app.use(express.static(__dirname + '/public'))
	.use(cookieParser());

app.get('/spotifyLogin', function(req, res) {

	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	var scope = 'playlist-read-private';
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: apiSecrets.spotifyClientId,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
	}));
});

app.get('/callback', function(req, res) {

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
		}));
	}
	
	res.clearCookie(stateKey);
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(apiSecrets.spotifyClientId + ':' + apiSecrets.spotifyClientSecret).toString('base64'))
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {

		if (isBadResponse(error, response.statusCode)) {
			res.redirect('/#' +
				querystring.stringify({
					error: 'invalid_token'
			}));
		}

		var access_token = body.access_token,
			refresh_token = body.refresh_token;

		var options = {
			url: 'https://api.spotify.com/v1/me',
			headers: { 'Authorization': 'Bearer ' + access_token },
			json: true
		};
        request.get(options, function(error, response, body) {
						
			if (isBadResponse(error, response.statusCode)) {
				res.redirect('/#' +
					querystring.stringify({
						error: 'invalid_user_details'
				}));
			}
			
			res.redirect('/#' +
				querystring.stringify({
					spotify_access_token: access_token,
					spotify_refresh_token: refresh_token,
					spotify_user_id: response.body.id
			}));
        });
	});
});

console.log('Listening on 8888');
app.listen(8888);