spotify-to-deezer
=================

Export your Spotify playlists to Deezer using node.js.

This application was written as experiment for myself, to create an application using node.js and JavaScript libraries to consume music streaming service APIs. The code is extended from the tutorial provided by Spotify (https://developer.spotify.com/web-api/tutorial/).

DISCLAIMER: This application is not complete. It is not the prettiest application, nor is the song matching algorithm as robust as I would like it to be. I have plans to take this code and build a complete application from it. In the meantime I have uploaded this to GitHub for reference. I am fairly new to node.js and using promises to chain HTTP requests and constructive feedback is welcomed.

## Setup

Requires node.js

Register the application in Spotify (use https://developer.spotify.com/web-api/tutorial/ as a guide). Add the URL http://localhost:8888/spotifyCallback into Redirect URIs whitelist. Update the src/lib/api-secrets.js file with the client ID and secret key of your application.

Register the application in Deezer (use http://developers.deezer.com/guidelines/getting_started as a guide). Update the src/lib/api-secrets.js file with the application ID and secret key of your application.

In the base directory of the application run the following to install the required node.js modules.

    $ npm install

To start the application run the following from the src directory.

    $ node app.js
