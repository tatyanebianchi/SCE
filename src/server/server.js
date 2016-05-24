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
 */

'use strict'

// node.js
var cluster = require('cluster')
var nodeUtils = require('util')
var os = require('os')

// SCE
var sceUtils = require('./server_utils.js')

exports.bootSCE = function () {
  if (cluster.isMaster) {
    sceUtils.writeLog(os.EOL + os.EOL + os.EOL)
    sceUtils.writeLog('==============================================================')
    sceUtils.writeLog('Iniciando servidor com ' + os.cpus().length + ' workers', '900')
    sceUtils.writeLog('A aplicação está executando em: ' + process.cwd(), '900')

    if (sceUtils.isMP()) {
      /*
       * Inicia um processo adjacente ao processo mestre. Optimizando para máquinas
       * com mais de um núcleo.
       */
      for (var i = 0; i < os.cpus().length; i++) {
        cluster.fork()
      }
    } else {
      cluster.fork()
    }

    // Reiniciando o processo se houver exceção.
    cluster.on('exit', function (worker, code, signal) {
      setTimeout(function () {
        if (sceUtils.isDebug()) {
          nodeUtils.log('worker ' + worker.process.pid + ' morreu (' + (signal || code) + '). Reiniciando...')
        }

        sceUtils.writeLog('Algo sério aconteceu e o cluster está reiniciando o worker.', '904')

        cluster.fork()
      }, 500)
    })

    cluster.on('online', function (worker) {
      if (sceUtils.isDebug()) {
        nodeUtils.log('O worker ' + worker.id + ' está executando.')
      }

      sceUtils.writeLog('O worker ' + worker.id + ' está executando.', '900')
    })
  } else {
    // SCE
    var ws = require('./web_socket.js')
    var cadastro = require('./cadastro.js')

    // express e middleware
    var express = require('express')
    var bodyParser = require('body-parser')

    var app = express()

    // Pasta padrão para os arquivos do cliente.
    app.use(express.static('./src/public/'))

    // Middleware bodyParser
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    // Inicializando o web socket.
    ws.init()

    app.get('/', function (req, res) {
    })

    app.post('/cadastra_empresa', function (req, res) {
      cadastro.cadastraEmpresa(req.body, res)
    })

    app.post('/cadastra_estagiario', function (req, res) {
      cadastro.cadastraEstagiario(req.body, res)
    })

    app.post('/cadastra_orientador', function (req, res) {
      cadastro.cadastraOrientador(req.body, res)
    })

    app.post('/cadastra_turma', function (req, res) {
      cadastro.cadastraTurma(req.body, res)
    })

    // Capturando o erro 404.
    app.use(function (req, res, next) {
      res.status(404).sendFile(sceUtils.getFile('404.html'))
    })


    var server = app.listen(9000, function () {
      var host = server.address().address
      var port = server.address().port

      sceUtils.writeLog('Servidor executando em: ' + process.cwd(), '900')
      sceUtils.writeLog('Servidor escutando em: http://' + host + ':' + port, '900')
    })

    process.on('uncaughtException', function (err) {
      // construindo a pilha de rastreamento (I know, it sounds weird in portuguese)
      var stack = err.stack

      sceUtils.exceptionsCounter += 1
      sceUtils.writeLog('Exceção: ' + stack, '904')
      nodeUtils.log('Exceção: ' + stack)
      nodeUtils.inspect(stack)
      process.exit(7)
    })
  }
}
