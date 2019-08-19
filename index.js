var mongoose = require('mongoose');
var libphonenumber = require('google-libphonenumber');

var PhoneNumberFormat = {E164:0, INTERNATIONAL:1, NATIONAL:2, RFC3966:3};
var PhoneNumberType = {FIXED_LINE:0, MOBILE:1, FIXED_LINE_OR_MOBILE:2, TOLL_FREE:3, PREMIUM_RATE:4, SHARED_COST:5, VOIP:6, PERSONAL_NUMBER:7, PAGER:8, UAN:9, VOICEMAIL:10, UNKNOWN:-1};

var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

function validatePhone (val, options) {
  var required = (typeof options.required === 'function') ? options.required() : options.required;
  var passedAllowBlank = options.allowBlank && (val === '' || val === null);
  if (passedAllowBlank && !required) {
    return true;
  }
  let number;
  try {
    number = phoneUtil.parseAndKeepRawInput(val, options.defaultRegion);
  } catch (e) {
    return false;
  }
  let isValid = phoneUtil.isValidNumber(number) && phoneUtil.isPossibleNumber(number);
  if (isValid) {
    let numberType = phoneUtil.getNumberType(number);
    isValid = options.allowedNumberTypes.includes(numberType);
  }
  return isValid;
}

function Phone (path, options) {
  this.options = options;
  this.options.allowedNumberTypes = options.allowedNumberTypes || [PhoneNumberType.MOBILE, PhoneNumberType.FIXED_LINE_OR_MOBILE];
  this.options.phoneNumberFormat = options.phoneNumberFormat || undefined;
  this.options.defaultRegion = options.defaultRegion || undefined;
  this.options.parseOnGet = options.parseOnGet || false;
  this.path = path;
  mongoose.SchemaTypes.String.call(this, path, options);
  this.validate(function (val) { return validatePhone(val, options) }, options.message || 'invalid phone number');
}

Object.setPrototypeOf(Phone.prototype, mongoose.SchemaTypes.String.prototype);

Phone.prototype.cast = function (val) {
  let number;
  try {
    number = phoneUtil.parseAndKeepRawInput(val, this.options.defaultRegion);
  } catch (e) {
    return val;
  }
  return (!!this.options.phoneNumberFormat) ? phoneUtil.format(number, this.options.phoneNumberFormat) : val;
}

Phone.prototype.get = function (val) {
  if (!this.options.parseOnGet || !this.options.phoneNumberFormat) {
    return val;
  }
  let number;
  try {
    number = phoneUtil.parseAndKeepRawInput(val, this.options.defaultRegion);
  } catch (e) {
    return val;
  }
  return phoneUtil.format(number, this.options.phoneNumberFormat);
}

Phone.prototype.checkRequired = function (val) {
  return typeof val === 'string' && validatePhone(val, this.options);
};

mongoose.SchemaTypes.Phone = Phone;
mongoose.Types.Phone = String;

module.exports = {
  Phone: Phone,
  PhoneNumberFormat: PhoneNumberFormat,
  PhoneNumberType: PhoneNumberType
};