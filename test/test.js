/**
 * Arquivo que contém vários casos de teste para o banco de dados do SCE.
 */

var testCase = require('mocha').describe
var assertions = require('mocha').it
var assert = require('assert')

var SCEDb = require('../src/server/db_api.js')


testCase('API do banco de dados', function () {
  testCase('db_api.getEmpresas(callback)', function () {
    assertions('err tem que ser igual a undefined', function () {
      SCEDb.getEmpresas(function (data, err) {
        assert.equal(err, undefined)
      })
    })

    assertions('data tem que ser um objeto', function () {
      SCEDb.getEmpresas(function (data, err) {
        assert.equal(data, Object)
      })
    })
  })

  testCase('db_api.getOrientadores(callback)', function () {
    assertions('err tem que ser igual a undefined', function () {
      SCEDb.getOrientadores(function (data, err) {
        assert.equal(err, undefined)
      })
    })

    assertions('data tem que ser um objeto', function () {
      SCEDb.getOrientadores(function (data, err) {
        assert.equal(data, Object)
      })
    })
  })

  testCase('db_api.getClasses(callback)', function () {
    assertions('err tem que ser igual a undefined', function () {
      SCEDb.getClasses(function (data, err) {
        assert.equal(err, undefined)
      })
    })

    assertions('data tem que ser um objeto', function () {
      SCEDb.getClasses(function (data, err) {
        assert.equal(data, Object)
      })
    })
  })

  testCase('db_api.getEstagiarios(callback)', function () {
    assertions('err tem que ser igual a undefined', function () {
      SCEDb.getEstagiarios(function (data, err) {
        assert.equal(err, undefined)
      })
    })

    assertions('data tem que ser um objeto', function () {
      SCEDb.getEstagiarios(function (data, err) {
        assert.equal(data, Object)
      })
    })
  })

  testCase('db.deleteEstagiario(matricula, callback)', function () {
    var matricula = '201222800309'

    assertions('Se o estagiário existir no sistema, a função deve retornar um objeto.', function () {
      SCEDb.deleteEstagiario(matricula, function (data, err) {
        assert.equal(data, Object)
      })
    })
  })

  testCase('db.deleteOrientador(siap, callback)', function () {
    var siap = '115'

    assertions('Se o orientador existir no sistema, a função deve retornar um objeto.', function () {
      SCEDb.deleteOrientador(siap, function (data, err) {
        assert.equal(data, Object)
      })
    })
  })

  testCase('db.deleteEmpresa(idEmpresa, callback)', function () {
    var id_empresa = '4'

    assertions('Se a empresa existir no sistema, a função deve retornar um objeto.', function () {
      SCEDb.deleteEmpresa(id_empresa, function (data, err) {
        assert.equal(err, Object)
      })
    })
  })

  testCase('db.deleteTurma(idTurma, callback)', function () {
    var idTurma = 'T204-4TJ'

    assertions('Se a turma existir no sistema, a função deve retornar um objeto.', function () {
      SCEDb.deleteTurma(idTurma, function (data, err) {
        assert.equal(data, Object)
      })
    })
  })
})
