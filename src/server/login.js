/**
 *
 *
 */

'use strict'

// node.js
var path = require('path');
// WebSocket
var ws = require('./web-socket.js');
// SCE
var utils = require('./server-utils.js');
var mysql = require('./db_pool.js');
var db_api  = require('./db_api.js');


/**
 *
 * @param req
 * @param res
 */
exports.do_login = function(req, res) {
    var email = req.usuario.email;
    var senha = req.usuario.senha;

    db_api.getUsuarios(function callback(data, err) {
        // se erro estiver definido.
        if(err) {
            console.log("[DB_API] Erro de requisição: " + err)
            ws.send_json({
              code: '1004',
              desc: err
            })
            res.sendFile(utils.get_file("login.html"));
        }
        else {
            for(var i = 0; i < data.length; i++) {
                console.log(data[i].email + " - " + data[i].senha)
                if(email == data[i].email && senha == data[i].senha) {
                    ws.send_json({
                      code: '1000',
                      desc: 'Usuário autorizado.'
                    });
                    //TODO: Criar sessão do usuário (cookies).
                    res.sendFile(utils.get_file("/index.html"));
                }
                else {
                    if(i == (data.length - 1)) {
                        ws.send_json({
                          code: '1001',
                          desc: 'Usuário não autorizado.'
                        });
                        res.sendFile(utils.get_file("login.html"));
                        break;
                    }
                }
            }
        }
    });
 }

 exports.logout = function(req, res) {
   console.log('logging out!');
   res.sendFile(utils.get_file("login.html"));
 }
