var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('assert');

var db_api = require('../src/server/db_api.js'),
    web_socket = require('../src/server/web_socket.js');


testCase('API do banco de dados', function() {
  testCase('db_api.get_empresas(callback)', function() {
      assertions('err tem que ser igual a undefined', function() {
          db_api.get_empresas(function(data, err) {
              assert.equal(err, undefined);
          });
      });

      assertions('data tem que ser um objeto', function() {
          db_api.get_empresas(function(data, err) {
              assert.equal(data, Object);
          });
      });
  });

  testCase('db_api.get_orientadores(callback)', function() {
      assertions('err tem que ser igual a undefined', function() {
          db_api.get_orientadores(function(data, err) {
              assert.equal(err, undefined);
          });
      });

      assertions('data tem que ser um objeto', function() {
          db_api.get_orientadores(function(data, err) {
              assert.equal(data, Object);
          });
      });
  });

  testCase('db_api.get_classes(callback)', function() {
      assertions('err tem que ser igual a undefined', function() {
          db_api.get_classes(function(data, err) {
              assert.equal(err, undefined);
          });
      });

      assertions('data tem que ser um objeto', function() {
          db_api.get_classes(function(data, err) {
              assert.equal(data, Object);
          });
      });
  });

  testCase('db_api.get_estagiarios(callback)', function() {
    assertions('err tem que ser igual a undefined', function() {
        db_api.get_estagiarios(function(data, err) {
            assert.equal(err, undefined);
        });
    });

    assertions('data tem que ser um objeto', function() {
        db_api.get_estagiarios(function(data, err) {
            assert.equal(data, Object);
        });
    });
  });
});

// testCase('Web Sockets', function() {
//     testCase('get_companies', function() {
//         assertions('Should return something from the database', function() {
//
//
//         )};
//     });
// });

// testCase('Array', function() {
//   pre(function() {
//     // ...
//   });
//
//   var array = [1,2,3,4,5,6,7]
//
//   testCase('#indexOf()', function() {
//     assertions('should return -1 when not present', function() {
//       assert.equal(array.indexOf(14), -1);
//     });
//   });
//
//   testCase("#indexOf()", function() {
//     assertions('should return 1 when present', function() {
//       assert.equal(array.indexOf(2), 1);
//     })
//   });
// });
