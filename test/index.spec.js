var expect = require('chai').expect;

var Index = require('../index');

describe('A test', function() {
  
  it('should grab functions from index', function() {
    expect(Index.foo()).to.equal(1);
  });

});