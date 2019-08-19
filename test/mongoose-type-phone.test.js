/* global describe, it, expect */
require('mockingoose')
var mongoose = require('mongoose')
require('../')

mongoose.Promise = Promise

var UserSimple = mongoose.model('UserSimple', new mongoose.Schema({
  phone: mongoose.SchemaTypes.Phone
}))

var UserAllowBlank = mongoose.model('UserAllowBlank', new mongoose.Schema({
  phone: { type: mongoose.SchemaTypes.Phone, allowBlank: true }
}))

var UserRequired = mongoose.model('UserRequired', new mongoose.Schema({
  phone: {type: mongoose.SchemaTypes.Phone, required: true}
}))

var UserNested = mongoose.model('UserNested', new mongoose.Schema({
  phone: {
    work: {type: mongoose.SchemaTypes.Phone, required: true},
    home: {type: mongoose.SchemaTypes.Phone, required: true}
  }
}))

var UserCustomMessage = mongoose.model('UserCustomMessage', new mongoose.Schema({
  phone: { type: mongoose.SchemaTypes.Phone, message: 'error.phone' }
}))

describe('mongoose-type-phone', function () {
  it('should enable basic phone field-type in schema', function (done) {
    var user = new UserSimple()
    user.save(done)
  })

  it('should not enable blank value', function (done) {
    var user = new UserSimple()
    user.phone = ''
    user.validate(function (err) {
      expect(err.errors.phone.message).toEqual('invalid phone number')
      done()
    })
  })

  it('should enable an empty string value when allowBlank', function (done) {
    var user = new UserAllowBlank()
    user.phone = ''
    user.save(done)
  })

  it('should enable a null value when allowBlank', function (done) {
    var user = new UserAllowBlank()
    user.phone = null
    user.save(done)
  })

  it('should require phone', function (done) {
    var user = new UserRequired()
    user.validate(function (err) {
      expect(err.errors.phone.message).toEqual('Path `phone` is required.')
      done()
    })
  })

  it('should enable nested required phone', function (done) {
    var user = new UserNested()
    user.validate(function (err) {
      expect(err.errors['phone.home'].message).toEqual('Path `phone.home` is required.')
      expect(err.errors['phone.work'].message).toEqual('Path `phone.work` is required.')
      done()
    })
  })

  it('should not enable blank value with custom message', function (done) {
    var user = new UserCustomMessage()
    user.phone = ''
    user.validate(function (err) {
      expect(err.errors.phone.message).toEqual('error.phone')
      done()
    })
  })
})
