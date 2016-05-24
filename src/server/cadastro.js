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
var sceUtils = require('./server_utils.js')
var ws = require('./web_socket.js')


exports.cadastraEstagiario = function (req, res) {
  sceUtils.writeLog('Requisição de cadastro de estagiário recebido', '906')

  // Dados do estagiário a ser enviado ao banco de dados.
  var estagiario = []

  estagiario.push(req.estagiario.matricula)
  estagiario.push(req.estagiario.nome)
  estagiario.push(req.estagiario.periodo_inicio)
  estagiario.push(req.estagiario.periodo_fim)
  estagiario.push(req.estagiario.empresa)
  // foto, por enquanto a função não vai ser implementada.
  estagiario.push('')
  estagiario.push(req.estagiario.observacao)
  estagiario.push(req.estagiario.empresa)
  estagiario.push(req.estagiario.turma)
  estagiario.push(req.estagiario.orientador)

  sceDB.insertEstagiario(estagiario, function (data, err) {
    if (data) {
      sceUtils.writeLog('Estagiário(a) ' + estagiario[1] + ' inserido(a) no sistema', '903')
      res.sendFile(sceUtils.getFile('cadastra_estagiario.html'))

      ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
    } else {
      if (sceUtils.isDebug()) {
        console.log('Erro ao inserir estagiário: ' + err)
      }

      sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
      res.sendFile(sceUtils.getFile('cadastra_estagiario.html'))

      ws.sendClientMessage('1004', '[DB_API_ERR]', err)
    }
  })
}

exports.cadastraEmpresa = function (req, res) {
  sceUtils.writeLog('Requisição de cadastro de empresa recebido', '906')

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
      sceUtils.writeLog('Empresa ' + empresa[0] + ' inserida no sistema', '903')
      res.sendFile(sceUtils.getFile('empresas.html'))

      ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
    } else {
      if (sceUtils.isDebug()) {
        console.log('Erro ao inserir estagiário: ' + err)
      }

      sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
      res.status(400).sendFile(sceUtils.getFile('empresas.html'))

      ws.sendClientMessage('1004', '[DB_API_ERR]', err)
    }
  })
}


exports.cadastraOrientador = function (req, res) {
  sceUtils.writeLog('Requisição de cadastro de orientador recebido', '906')
  // dados que irão para o banco de dados.
  var orientador = []

  orientador.push(req.orientador.siap)
  orientador.push(req.orientador.nome)

  sceDB.insertOrientador(orientador, function (data, err) {
    if (data) {
      sceUtils.writeLog('Orientador ' + orientador[1] + ' inserido no sistema', '903')
      res.sendFile(sceUtils.getFile('orientadores.html'))

      ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
    } else {
      if (sceUtils.isDebug()) {
        console.log('Erro ao inserir orientador: ' + err)
      }

      sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
      res.status(400).sendFile(sceUtils.getFile('orientadores.html'))

      ws.sendClientMessage('1004', '[DB_API_ERR]', err)
    }
  })
}

exports.cadastraTurma = function (req, res) {
  sceUtils.writeLog('Requisição de cadastro de turma recebido', '906')
  // dados que irão para o banco de dados.
  var turma = []

  turma.push(req.turma.id_turma)
  turma.push(req.turma.turno)
  turma.push(req.turma.curso)

  sceDB.insertTurma(turma, function (data, err) {
    if (data) {
      sceUtils.writeLog('Turma ' + turma[2] + ' inserida no sistema', '903')
      res.sendFile(sceUtils.getFile('turmas.html'))

      ws.sendClientMessage('1000', 'Cadastro bem sucedido', '')
    } else {
      if (sceUtils.isDebug()) {
        console.log('Erro ao inserir turma: ' + err)
      }

      sceUtils.writeLog('[DB_API_ERR] ' + err, '904')
      res.status(400).sendFile(sceUtils.getFile('turmas.html'))

      ws.sendClientMessage('1004', '[DB_API_ERR]', err)
    }
  })
}
