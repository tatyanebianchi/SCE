var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('assert');

testCase('Array', function() {
  pre(function() {
    // ...
  });

  var array = [1,2,3,4,5,6,7]

  testCase('#indexOf()', function() {
    assertions('should return -1 when not present', function() {
      assert.equal(array.indexOf(14), -1);
    });
  });

  testCase("#indexOf()", function() {
    assertions('should return 1 when present', function() {
      assert.equal(array.indexOf(2), 1);
    })
  });
});

describe('', function() {
  
});
