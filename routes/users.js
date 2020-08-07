const express = require('express');
const router = express.Router();

const artworkifier = require('../artworkifier');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send(artworkifier);
});

module.exports = router;
