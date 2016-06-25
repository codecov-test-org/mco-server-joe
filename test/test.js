/* global it describe */
/* jshint unused: false */
var fs = require('fs')
var database = require('../src/mco-server/database.js')
var should = require('should')

describe('Files', function () {
  // TODO: Add test pub.key
  it.skip('should locate the pub.key file', function () {
    should(fs.statSync('./data/pub.key').isFile()).equal(true)
  })
  // TODO: Add test private_key.pem
  it.skip('should locate the private_key.pem file', function () {
    should(fs.statSync('./data/private_key.pem').isFile()).equal(true)
  })
})

describe('Databases', function () {
  it('should be able to create tables', function (done) {
    database.dbCreateTables(function (err, res) {
      if (err) {
        err.should.equal('moo')
        done()
      }
      should.not.exist(res)
      done()
    })
  })
  it('should be able to write to the database', function (done) {
    database.dbInsertPersonas(function (err, res) {
      if (err) {
        err.should.equal('moo')
        done()
      }
      should.not.exist(res)
      done()
    })
  })
  it('should be able to fetch persona by customer id', function (done) {
    database.dbFetchPersonaByCustomerId('Zeta 3', function (err, res) {
      if (err) {
        err.should.equal('moo')
        done()
      }
      res = JSON.parse(res)
      res.racer_name.should.equal('Lorem 3')
      done()
    })
  })
  it('should be able to delete from the database', function (done) {
    database.dbDeletePersonas(function (err, res) {
      if (err) {
        err.should.equal('moo')
        done()
      }
      should.not.exist(res)
      done()
    })
  })
})

describe('Connections', function () {
  it('should be able to connect to the login port')
  it('should be able to connect to the persona port')
  it('should be able to connect to the lobby port')
  it('should be able to connect to the admin port')
})

describe('Encryption', function () {
  it('should be able to encrypt 1 NPS command in a row')
  it('should be able to encrypt 2 NPS commands in a row')
  it('should be able to decrypt 1 NPS command in a row')
  it('should be able to decrypt 2 NPS commands in a row')
})

describe('NPS Commands', function () {
  it('should be able to understand NPSGetPersonaInfoByName')
})

describe('Admin API', function () {
  it('should be able to understand start on port xxxx')
  it('should be able to understand stop on port xxxx')
})