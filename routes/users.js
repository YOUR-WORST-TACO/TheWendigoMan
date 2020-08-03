var express = require('express');
var router = express.Router();

var testVariable = require('../artworkifier');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send(testVariable);
});

module.exports = router;
