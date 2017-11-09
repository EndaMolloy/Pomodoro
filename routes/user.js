const express = require('express');
const router = express.Router();
const gapi = require('../lib/gapi')


router.get('/enda', (req, res) => {
  res.redirect(gapi.url)

});

router.get('/oauth2callback', (req, res) => {
  var code = req.query.code;
  //console.log(code);

  gapi.client.getToken(code, function (err, tokens) {
      if (err) {
        return err;
      }
      gapi.client.setCredentials(tokens);
      console.log(tokens);

      



    });

});

module.exports = router;
