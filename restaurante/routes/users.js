var express = require('express');
var connection = require('./../utils/connection_database')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM tb_users ORDER BY NAME", (err, results) => {
    if(err) {
      res.send(err)
    } else {
      res.send(results)
    }
  })
});

module.exports = router;
