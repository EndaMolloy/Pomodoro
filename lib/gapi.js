var googleapis = require('googleapis')
var OAuth2Client = googleapis.auth.OAuth2
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
var CLIENT_ID = '1003828564878-g615ru3uuprqa5uqcu0osqce5a3q8nil.apps.googleusercontent.com'
var CLIENT_SECRET = 'tHAYdXfY5YvtItwI3p2dt72K'
var REDIRECT_URL = 'http://localhost:3000/user/oauth2callback'

    var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

    var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

exports.url = authUrl;
exports.client = oauth2Client;
