/**
 *
 *
 */

'use strict'

// node.js
var path = require('path');
//
var ws = require('./web-socket.js')
// SCE
var utils = require('./server-utils.js')

exports.do_login = function(req, res) {
   var email = req.usuario.email;
   var senha = req.usuario.senha;

   var index_page = path.join(utils.public_dir(), "index.html");

   res.sendFile(index_page);
   ws.send_message("login error");
   //ws.send_json("error: asdsad");
 }
