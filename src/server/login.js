/**
 *
 *
 */

'use strict'

// node.js
var path = require('path');

// SCE
var utils   = require('./server_utils.js'),
    ws      = require('./web_socket.js'),
    mysql   = require('./db_pool.js'),
    db_api  = require('./db_api.js');


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
            res.sendFile(utils.get_file("login.html"));
            console.log("[DB_API] Erro de requisição: " + err)
            ws.send_json({
              code: '1004',
              desc: err
            });
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
