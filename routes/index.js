var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { room: '' });
});

router.get('/:room/*', function(req, res) {
    console.log('redirecting to ' + req.params.room);
    res.redirect('/' + req.params.room);
});

router.get('/:room', function(req, res) {
    res.render('index', { room: req.params.room });
});

module.exports = router;
