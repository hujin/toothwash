const express = require('express');
const path =require('path');
const router = express.Router();

router.get('/[^.]+',function (req, res, next) {
    var url = path.join(__dirname,'../src/' + req.originalUrl.substring(1).split('?')[0] + '.json');
    res.sendFile(url);
});


router.post('/[^.]+',function (req, res, next) {
    var url = path.join(__dirname,'../src/' + req.originalUrl.substring(1).split('?')[0] + '.json');
    res.sendFile(url);
});

module.exports = router;