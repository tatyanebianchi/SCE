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

// SCE
var sceUtils = require('./src/server/server_utils.js')
var sceServer = require('./src/server/server.js')

var argv = require('yargs')
      .boolean(['d', 'np', 'debug'])
      .help('h')
      .alias('h', 'help')
      .nargs('d')
      .describe('d', 'O servidor vai funcionar em modo debug, o que o fará ' +
                'emitir mensagens de aviso/erro na stdout')
      .nargs('debug')
      .describe('debug', 'Equivalente a opção d')
      .nargs('np')
      .describe('np', 'Opção não multi processamento, desabilita o multi processamento do servidor.' +
                ' Fazendo com que o mesmo execute utilizando somente um núcleo lógico do processador')
      .example('iniciar_servidor\.(sh|bat)')
      .example('iniciar_servidor\.(sh|bat) --debug --np')
      .locale('pt_BR')
      .argv

if (argv.debug || argv.d) {
  sceUtils.setDebug(true)
}
if (argv.np) {
  sceUtils.setMultiProcessamento(false)
}

sceUtils.createLogDir()
sceServer.bootSCE()
