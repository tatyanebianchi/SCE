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
 * Arquivo para prover diversas utilidades ao servidor.
 */

'use strict'

var path = require('path')
var fs = require('fs')
var util = require('util')

// variável que controla se o sce está em modo debug.
var sce_debug = false

// Caminho relativo para o arquivo server.log
var log_file = './log/server.log'

// Número de exceções que o servidor sofreu.
var exceptionsCounter = 0

// Diretório absoluto para a pasta pública - do cliente -.
exports.publicDir = function () {
  return path.join(process.cwd(), '../public/')
}

/**
 * Função que retorna o caminho absoluto para um arquivo na pasta public.
 * @param file Arquivo a ser buscado.
 */
exports.getFile = function (file) {
  var public_dir = path.join(process.cwd(), '../public/')
  return path.join(public_dir, file)
}

/**
 * Função que escreve na saída padrão uma mensagem juntamente com a tipagem do
 * parâmetro variable.
 * @param message O nome da variável a ser testada.
 * @param variable A variável em que será aplicada o typeof.
 */
exports.type = function (message, variable) {
  util.log(message + ' typeof -> ' + typeof (variable))
}

exports.isDebug = function () {
  return sce_debug
}

exports.setDebug = function (boolean) {
  sce_debug = boolean
}

/**
 * Função que retorna as propriedades do servidor ao cliente.
 */
exports.getProperties = function () {
  var Properties = {
    exceptions: 0,
    logDir: undefined,
    nodejsVer: undefined,
    execPath: undefined
  }

  Properties.exceptions = exceptionsCounter
  Properties.logDir = log_file
  Properties.nodejsVer = process.version
  Properties.execPath = process.cwd()
  return Properties
}

exports.writeLog = function (message, errorCode) {
   // TODO: Criar log com nome: dia-mes-ano-log.log
  var date = Date()
  fs.open(log_file, 'a', function (err, fd) {
    if (err) {
      util.log('Erro ao abrir o arquivo ' + log_file + ' para escrita.')
    } else {
      var log_message = date + ' LOG: ' + errorCode + ' -> ' + message + '\n'

      fs.appendFileSync(log_file, log_message, 'utf8',
      function (err) {
        if (err) {
          util.log('Erro ao adicionar texto para o arquivo.')
        }
      })
    }
  })
}
