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
 * Script para gerenciar todo tipo de cadastro  feito no  aplicação.
 */

// SCE
var sceDB = require('./db_api.js')
var utils = require('./server_utils.js')
var ws = require('./web_socket.js')


exports.cadastraEstagiario = function (req, res) {
  utils.writeLog('Requisição de cadastro de estagiario recebido', '906')

  var empresa_siap = null
  // Dados do estagiário a ser enviado ao banco de dados.
  var estagiario = []

  // FIXME: sql injection abaixo.
  sceDB.query('SELECT id_empresa FROM sce.empresa WHERE nome = \"' +
               req.estagiario.empresa + '\"',
               function (empresa_query_data, empresa_query_err) {
                 if (empresa_query_data) {
                   empresa_siap = empresa_query_data[0].id_empresa

                   estagiario.push(req.estagiario.matricula)
                   estagiario.push(req.estagiario.nome)
                   estagiario.push(req.estagiario.periodo_inicio)
                   estagiario.push(req.estagiario.periodo_fim)
                   estagiario.push(req.estagiario.empresa)
                   estagiario.push('') // foto, por enquanto a função não vai ser implementada.
                   estagiario.push(req.estagiario.observacao)
                   estagiario.push(empresa_siap)
                   estagiario.push(req.estagiario.turma)
                   estagiario.push(req.estagiario.orientador)

                   sceDB.insertEstagiario(estagiario, function (data, err) {
                     if (data) {
                       utils.writeLog('Estagiário(a) ' + estagiario[1] + ' inserido(a) no sistema', '903')
                       res.sendFile(utils.getFile('cadastra_estagiario.html'))

                       ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
                     } else {
                       if (utils.isDebug()) {
                         console.log('Erro ao inserir estagiário: ' + err)
                       }

                       utils.writeLog('[DB_API_ERR] ' + err, '904')
                       res.sendFile(utils.getFile('cadastra_estagiario.html'))

                       ws.sendClientMessage('1004', '[DB_API_ERR]', err)
                     }
                   })
                 } else {
                   if (utils.isDebug()) {
                     console.log('Erro ao buscar id da empresa: ' + empresa_query_err)
                   }

                   utils.writeLog('[DB_API_ERR] ' + empresa_query_err, '904')
                   res.status(400).sendFile(utils.getFile('cadastra_estagiario.html'))

                   ws.sendClientMessage('1004', '[DB_API_ERR]', empresa_query_err)
                 }
               })
}

exports.cadastraEmpresa = function (req, res) {
  utils.writeLog('Requisição de cadastro de empresa recebido', '906')

  // dados da empresa
  var empresa = []

  empresa.push(req.empresa.nome)
  empresa.push(req.empresa.razao_social)
  empresa.push(req.empresa.cnpj)
  empresa.push(req.empresa.email)
  empresa.push(req.empresa.telefone)
  empresa.push(req.empresa.telefone_2)
  empresa.push(req.empresa.rua)
  empresa.push(req.empresa.numero)
  empresa.push(req.empresa.bairro)
  empresa.push(req.empresa.cep)

  sceDB.insertEmpresa(empresa, function (data, err) {
    if (data) {
      utils.writeLog('Empresa ' + empresa[0] + ' inserida no sistema', '903')
      res.sendFile(utils.getFile('empresas.html'))

      ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
    } else {
      if (utils.isDebug()) {
        console.log('Erro ao inserir estagiário: ' + err)
      }

      utils.writeLog('[DB_API_ERR] ' + err, '904')
      res.status(400).sendFile(utils.getFile('empresas.html'))

      ws.sendClientMessage('1004', '[DB_API_ERR]', err)
    }
  })
}


exports.cadastraOrientador = function (req, res) {
  utils.writeLog('Requisição de cadastro de orientador recebido', '906')
  // dados que irão para o banco de dados.
  var orientador = []

  orientador[0] = req.orientador.siap
  orientador[1] = req.orientador.nome

  sceDB.insertOrientador(orientador, function (data, err) {
    if (data) {
      utils.writeLog('Orientador ' + orientador[1] + ' inserido no sistema', '903')
      res.sendFile(utils.getFile('orientadores.html'))

      ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
    } else {
      if (utils.isDebug()) {
        console.log('Erro ao inserir orientador: ' + err)
      }

      utils.writeLog('[DB_API_ERR] ' + err, '904')
      res.status(400).sendFile(utils.getFile('orientadores.html'))

      ws.sendClientMessage('1004', '[DB_API_ERR]', err)
    }
  })
}

exports.cadastraTurma = function (req, res) {
  utils.writeLog('Requisição de cadastro de turma recebido', '906')
  // dados que irão para o banco de dados.
  var turma = []

  turma[0] = req.turma.id_turma
  turma[1] = req.turma.turno
  turma[2] = req.turma.curso

  sceDB.insertTurma(turma, function (data, err) {
    if (data) {
      utils.writeLog('Turma ' + turma[2] + ' inserida no sistema', '903')
      res.sendFile(utils.getFile('turmas.html'))

      ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
    } else {
      if (utils.isDebug()) {
        console.log('Erro ao inserir turma: ' + err)
      }

      utils.writeLog('[DB_API_ERR] ' + err, '904')
      res.status(400).sendFile(utils.getFile('turmas.html'))

      ws.sendClientMessage('1004', '[DB_API_ERR]', err)
    }
  })
}
