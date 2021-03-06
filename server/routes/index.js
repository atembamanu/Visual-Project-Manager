const express = require('express');
const featuresController = require('../controllers').features;
const featureItemsController = require('../controllers').featureItems;
const cookieController = require('../controllers').cookie;
const sessionController = require('../controllers').session;
const request = require('request');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');

module.exports = (app) => {
  // logger function to debug through middleware
  var myLogger = function (req, res, next) {
    console.log(req.body)
    console.log('LOGGED')
    next()
  }

  app.get('/OAuth', (req, res, next) => {
    // https://github.com/login/oauth/authorize?client_id=35add40e3b7a5d3457eb&redirect_uri=http://localhost:8000/OAuth
    var uri = req.url;
    var code = uri.substring(uri.indexOf("=") + 1, uri.length);
    // get below info from https://github.com/settings/applications/506837
    var client_id = "35add40e3b7a5d3457eb";
    var redirect_uri = "http://localhost:8000/OAuth";
    var client_secret = "f129ad0c4e493bb07931cbb7278206d5d7004d73";
    var access_token;
    var post_uri = "https://github.com/login/oauth/access_token?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&client_secret=" + client_secret + "&code=" + code;
    request(post_uri, function (error, response, body) {
      if (error) {
        console.log('*Error occurred in request to Github for access token...', error);
      }
      else {
        console.log('*Status code is...', response && response.statusCode); // Print the response status code if a response was received
        var access_token = body.substring(body.indexOf("=") + 1, body.indexOf("&"));
        console.log("*We are in the response from Github" + access_token);
        res.locals.access_token = access_token;
        return next();
      }
    });
  }, cookieController.setCookie, sessionController.create, (req, res, next) => {
    console.log("*we are in the final step");
    res.status(200);
    // res.send();
    res.redirect('/');
    // res.render('./../../index.html');
    // res.render("http://localhost:8000/#/");
  });

  // Verify user, else direct them to login page
  // Save projects to collection associated with User

  // Save one feature title and the deadline to the database
  app.post('/api/features', featuresController.create);

  // Return all of the features currently in the database along with the feature list
  app.get('/api/features', featuresController.list);

  // Add a Feature List Item to the inputted feature ID
  app.post('/api/features/:featureId/items', featureItemsController.create);

  // get list of all featureItems associated with a feature
  app.get('/api/features/:featureId/items', featureItemsController.list);

  // Find a single feature based on ID
  app.get('/api/features/:featureId', featuresController.retrieve);

  // Update a single feature and return the (number completed/total)
  app.put('/api/features/:featureId', featuresController.update);

  // Delete a single feature
  app.delete('/api/features/:featureId', featuresController.destroy);

  // Delete a single feature list items
  app.delete('/api/features/:featureId/items/:featureItemId', featureItemsController.destroy);

  // Update a single feature list items
  app.post('/api/features/:featureId/items/:featureItemId', featureItemsController.update);
};
