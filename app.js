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

// NodeJS
var util = require('util')

// SCE
var sceUtils = require('./src/server/server_utils.js')
var sceServer = require('./src/server/server.js')

if (process.argv[2] === '-d' || process.argv[2] === '-debug') {
  sceUtils.createLogDir()
  sceUtils.setDebug(true)
  sceServer.bootSCE()
} else if (process.argv[2] === '-h') {
  console.log('Uso: ')
  console.log('    nodejs server <opções>')
  console.log('Opções: ')
  console.log('    -d: opção debug, o servidor vai funcionar em modo debug, o que o fará ')
  console.log('emitir mensagens de aviso/erro na stdout.')
  console.log('    -h: opção ajuda, mostra esse menu.')
  process.exit()
} else if (process.argv[2]) {
  console.error('Flag ' + process.argv[2] + ' inválida.\n')
  console.log('Uso: ')
  console.log('    nodejs server <opções>')
  console.log('Opções: ')
  console.log('    -d: opção debug, o servidor vai funcionar em modo debug, o que o fará ')
  console.log('emitir mensagens de aviso/erro na stdout.')
  console.log('    -h: opção ajuda, mostra esse menu.')
  process.exit(1)
} else {
  sceUtils.createLogDir()
  sceServer.bootSCE()
}
