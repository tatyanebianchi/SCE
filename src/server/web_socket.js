/**
 * Este arquivo pertence ao SCE - Sistema de Controle de Estágio -, cuja função
 * é realizar o controle de estágio para discentes do IFPA.
 * Copyright (C) 2015  Rafael Campos Nunes
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Script cuja função  é  receber,  interpretar  e  responder  clientes em suas
 * respectivas requisições.
 */

'use strict'

// SCE
var sceDB = require('./db_api.js')
var sceUtils = require('./server_utils.js')

// nodejs
var util = require('util')

var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({
  port: 9005
})

exports.init = function () {
  if (sceUtils.isDebug()) {
    util.log('Web socket inicializado')
  }

  sceUtils.writeLog('Web socket inicializado', '900')
}

/**
 * Método para enviar uma mensagem ao cliente.
 * @param {String} code Código de estado a ser enviado ao cliente
 * @param {String} desc Descrição da mensagem a ser enviada
 * @param {Anything} message Mensagem a ser enviada ao cliente
 * Para entender o protocolo de comunicação do SCE leia o README.md dentro da pasta do servidor.
 */
exports.sendClientMessage = function (code, desc, message) {
  wss.on('connection', function connection (ws) {
    switch (code) {
      case '1004':
        sendError(ws, desc, message, 'sendClientMessage')
        break
      case '1000':
      case '1007':
        sendMessage(ws, desc, message, 'sendClientMessage')
        break
    }
  })
}

/**
 * Função para conversar com o cliente, isto é, quando algum cliente da
 * aplicação requisita algo o servidor interpreta a requisição e manda a
 * informação necessária de volta ao cliente.
 */
wss.on('connection', function connection (ws) {
  ws.on('error', function (error) {
    if (error) {
      util.log('WebSockets sofreu um erro: ' + error)
    }
  })

  ws.on('open', function () {
    util.log('Cliente conectado')
  })

  ws.on('message', function (message) {
    if (sceUtils.isDebug()) {
      util.log('Mensagem do cliente recebida: ' + message)
    }

    sceUtils.writeLog('Mensagem do cliente recebida: ' + message, '906')

    message = JSON.parse(message)

    // TODO: Verificar se o socket está aberto para enviar a mensagem. (ReadyState = 1)
    switch (message.code) {
      case '1006': // requisição
        switch (message.desc) {
          case 'get_companies':
            sceDB.get_empresas(function (data, err) {
              if (sceUtils.isDebug()) {
                sceUtils.type('Objeto retornado do banco de dados', data)
                sceUtils.type('Erro no banco de dados', err)
              }

              if (data) {
                var empresas = []
                empresas = data.slice()

                sendMessage(ws, 'empresas', empresas, 'get_companies')
              } else {
                if (sceUtils.isDebug()) {
                  util.log('Erro em \'get_companies\': ' + err)
                }

                sendError(ws, '[DB_API_ERR]', err, 'get_companies')
                sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
              }
            })
            break
          case 'search':
            if (message.value.search_for[0] === 'estagiario') {
              sceDB.search('estagiario', message.value, function (data, err) {
                if (sceUtils.isDebug()) {
                  sceUtils.type('Objeto retornado do banco de dados', data)
                  sceUtils.type('Erro no banco de dados', err)
                }

                if (data) {
                  var pesquisa_estagiarios = []
                  pesquisa_estagiarios = data.slice()

                  sendMessage(ws, 'estagiarios', pesquisa_estagiarios, 'search')
                } else {
                  if (sceUtils.isDebug()) {
                    util.log('Erro em \'search\': ' + err)
                  }

                  sendError(ws, '[DB_API_ERR]', err, 'search')
                  sceUtils.writeLog('[DB_API_ERR]' + err, '904')
                }
              })
            } else if (message.value.search_for[0] === 'turma') {
              sceDB.search('turma', message.value, function (data, err) {
                if (sceUtils.isDebug()) {
                  sceUtils.type('Objeto retornado do banco de dados', data)
                  sceUtils.type('Erro no banco de dados', err)
                }

                if (data) {
                  var turmas = []
                  turmas = data.slice()

                  sendMessage(ws, 'turmas', turmas, 'search')
                } else {
                  if (sceUtils.isDebug()) {
                    util.log('Erro em \'search\': ' + err)
                  }

                  sendError(ws, '[DB_API_ERR]', err, 'search')
                  sceUtils.writeLog('[DB_API_ERR]' + err, '904')
                }
              })
            } else if (message.value.search_for[0] === 'orientador') {
              sceDB.search('orientador', message.value, function (data, err) {
                if (sceUtils.isDebug()) {
                  sceUtils.type('Objeto retornado do banco de dados', data)
                  sceUtils.type('Erro no banco de dados', err)
                }

                if (data) {
                  var orientadores = []
                  orientadores = data.slice()

                  sendMessage(ws, 'orientadores', orientadores, 'search')
                } else {
                  if (sceUtils.isDebug()) {
                    util.log('Erro em \'search\': ' + err)
                  }

                  sendError(ws, '[DB_API_ERR]', err, 'search')
                  sceUtils.writeLog('[DB_API_ERR]' + err, '904')
                }
              })
            } else {
              // NOTE: alguém por acaso está tentando fazer XSS
            }
            break
          case 'get_tutors':
            sceDB.get_orientadores(function (data, err) {
              if (sceUtils.isDebug()) {
                sceUtils.type('Objeto retornado do banco de dados', data)
                sceUtils.type('Erro no banco de dados', err)
              }

              if (data) {
                var orientadores = []
                orientadores = data.slice()

                sendMessage(ws, 'orientadores', orientadores, 'get_tutors')
              } else {
                if (sceUtils.isDebug()) {
                  util.log('Erro em \'get_tutors\': ' + err)
                }

                sendError(ws, '[DB_API_ERR]', err, 'get_tutors')
                sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
              }
            })
            break
          case 'get_classes':
            sceDB.get_classes(function (data, err) {
              if (sceUtils.isDebug()) {
                sceUtils.type('Objeto retornado do banco de dados', data)
                sceUtils.type('Erro no banco de dados', err)
              }

              if (data) {
                var classes = []
                classes = data.slice()

                sendMessage(ws, 'classes', classes, 'get_classes')
              } else {
                if (sceUtils.isDebug()) {
                  util.log('Erro em \'get_classes\': ' + err)
                }

                sendError(ws, '[DB_API_ERR]', err, 'get_classes')
                sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
              }
            })
            break
          case 'delete_turma':
            sceDB.delete_turma(message.value, function (data, err) {
              if (sceUtils.isDebug()) {
                sceUtils.type('Objeto retornado do banco de dados', data)
                sceUtils.type('Erro no banco de dados', err)
              }

              if (data) {
                sendMessage(ws, 'delete_turma', null, 'delete_turma')
              } else {
                if (sceUtils.isDebug()) {
                  util.log('Erro em \'delete_turma\': ' + err)
                }

                sendError(ws, '[DB_API_ERR]', err, 'delete_turma')
                sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
              }
            })
            break
          case 'delete_estagiario':
            sceDB.delete_estagiario(message.value, function (data, err) {
              if (sceUtils.isDebug()) {
                sceUtils.type('Objeto retornado do banco de dados', data)
                sceUtils.type('Erro no banco de dados', err)
              }

              if (data) {
                sendMessage(ws, 'delete_estagiario', null, 'delete_estagiario')
              } else {
                if (sceUtils.isDebug()) {
                  util.log('Erro em \'delete_estagiario\': ' + err)
                }

                sendError(ws, '[DB_API_ERR]', err, 'delete_estagiario')
                sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
              }
            })
            break
          case 'delete_orientador':
            sceDB.delete_orientador(message.value, function (data, err) {
              if (sceUtils.isDebug()) {
                sceUtils.type('Objeto retornado do banco de dados', data)
                sceUtils.type('Erro no banco de dados', err)
              }

              if (data) {
                sendMessage(ws, 'delete_orientador', null, 'delete_orientador')
              } else {
                if (sceUtils.isDebug()) {
                  util.log('Erro em \'delete_orientador\': ' + err)
                }

                sendError(ws, '[DB_API_ERR]', err, 'delete_orientador')
                sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
              }
            })
            break
          case 'delete_empresa':
            sceDB.delete_empresa(message.value, function (data, err) {
              if (sceUtils.isDebug()) {
                sceUtils.type('Objeto retornado do banco de dados', data)
                sceUtils.type('Erro no banco de dados', err)
              }

              if (data) {
                sendMessage(ws, 'delete_empresa', null, 'delete_empresa')
              } else {
                if (sceUtils.isDebug()) {
                  util.log('Erro em \'delete_empresa\': ' + err)
                }

                sendError(ws, '[DB_API_ERR]', err, 'delete_empresa')
                sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
              }
            })
            break
          case 'get_server_status':
            var ServerStatus = sceUtils.getProperties()
            sendMessage(ws, 'server_state', ServerStatus, 'get_server_status')
            break
          case 'get_db_status':
            sceDB.query('SELECT VERSION();', function (data, err) {
              var DatabaseState = {
                connection: undefined,
                error: undefined,
                version: undefined
              }

              if (data) {
                DatabaseState.connection = true
                DatabaseState.version = data[0]

                sendMessage(ws, 'database_state', DatabaseState, 'get_db_status')
              } else {
                if (err.code === 'ECONNREFUSED') {
                  DatabaseState.connection = false
                  DatabaseState.error = err

                  sendError(ws, 'database_state', DatabaseState, 'get_db_status')
                } else {
                  DatabaseState.connection = true
                  DatabaseState.error = err

                  sendError(ws, 'database_state', DatabaseState, 'get_db_status')
                }
              }
            })
            break
        }
        break
    }
  })
})

/**
 * Função auxiliar que envia uma mensagem através do web socket.
 * code: 1007. Mais informações sobre a estrutura da mensagem em README.md.
 * @param {Object} ws Objeto WebSocket.
 * @param {String} _desc Descrição do valor a ser enviado ao cliente.
 * @param {Object} _value Valor a ser enviado ao cliente.
 * @param {String} where Onde ocorreu o envio.
 */
function sendMessage (ws, _desc, _value, where) {
  if (sceUtils.isDebug()) {
    util.log('Mensagem a ser enviada: ' + _desc + ' - ' + _value)
  }

  sceUtils.writeLog('Mensagem a ser enviada ao cliente: ' + _desc + ' - ' + _value, '907')

  ws.send(JSON.stringify({
    code: '1007',
    desc: _desc,
    value: _value
  }), function (error) {
    if (error) {
      sceUtils.writeLog('Erro ao enviar informação ao cliente em \'' + where + '\': ' + error, '904')
      if (sceUtils.isDebug()) {
        util.log('Erro ao tentar enviar a mensagem \'' + _desc + '\' para o cliente em \'' + where + '\': ' + error)
      }
    }
  })
}

/**
 * Função auxiliar que enviar uma mensagem de erro através do web socket.
 * code: 1004. Mais informações sobre a estrutura da mensagem em README.md.
 * @param {Object} ws Objeto WebSocket.
 * @param {String} _desc Descrição do valor a ser enviado ao cliente.
 * @param {Object} _value Valor a ser enviado ao cliente.
 * @param {String} where Onde ocorreu o envio.
 */
function sendError (ws, _desc, _value, where) {
  if (sceUtils.isDebug()) {
    util.log('Mensagem a ser enviada: ' + _desc + ' - ' + _value)
  }

  sceUtils.writeLog('Mensagem a ser enviada ao cliente: ' + _desc + ' - ' + _value, '907')

  ws.send(JSON.stringify({
    code: '1004',
    desc: _desc,
    value: _value
  }), function (error) {
    if (error) {
      sceUtils.writeLog('Erro ao enviar informação ao cliente em \'' + where + '\': ' + error, '904')
      if (sceUtils.isDebug()) {
        util.log('Erro ao tentar enviar a mensagem \'' + _desc + '\' para o cliente em \'' + where + '\': ' + error)
      }
    }
  })
}
