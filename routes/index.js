const express = require('express');
const router = express.Router();
const artworkifier = require('../artworkifier');
const path = require('path');

const artworkPath = path.join(__dirname, '../public/artwork');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let artFiles = artworkifier.artFiles;
  res.render('index', { art_tiles: artFiles });
});

module.exports = router;
