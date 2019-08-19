# mongoose-type-phone

A phone field-type for Mongoose schemas based on [mongoose-type-email](https://www.npmjs.com/package/mongoose-type-email), [mongoose-intl-phone-number](https://www.npmjs.com/package/mongoose-intl-phone-number) and [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber).

[![npm](https://nodei.co/npm/mongoose-type-phone.png)](https://www.npmjs.com/package/mongoose-type-phone)

[![Greenkeeper badge](https://badges.greenkeeper.io/konsumer/mongoose-type-phone.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/konsumer/mongoose-type-phone.svg?branch=master)](https://travis-ci.org/konsumer/mongoose-type-phone)
[![Code Climate](https://codeclimate.com/github/konsumer/mongoose-type-phone/badges/gpa.svg)](https://codeclimate.com/github/konsumer/mongoose-type-phone)

## usage

This will validate phone, correctly:

```js
var mongoose = require('mongoose');
var mongooseTypePhone = require('mongoose-type-phone');

var UserSchema = new mongoose.Schema({
    phone: {
        work: mongoose.SchemaTypes.Phone,
        home: mongoose.SchemaTypes.Phone
    }
});
```

You can also use the stuff in `String` type:

```js
var UserSchema = new mongoose.Schema({
    phone: {
        work: {type: mongoose.SchemaTypes.Phone, required: true},
        home: {type: mongoose.SchemaTypes.Phone, required: true},
    }
});
```

You can also use it as an array:


```js
var UserSchema = new mongoose.Schema({
    phones: [{type: mongoose.SchemaTypes.Phone}]
});
```

You can add 'allowBlank: true' in order to allow empty string ('') when the field is not required

```js
var mongoose = require('mongoose');
var mongooseTypePhone = require('mongoose-type-phone');

var UserSchema = new mongoose.Schema({
    phone: {
        work: { type: mongoose.SchemaTypes.Phone, allowBlank: true }, // allows '' as a value
        home: mongoose.SchemaTypes.Phone // throws when the value is ''
    }
});
```

Here is the example with full set of available options:
```js
var mongoose = require('mongoose');
var mongooseTypePhone = require('mongoose-type-phone');

var UserSchema = new mongoose.Schema({
    phone: {
        type: mongoose.SchemaTypes.Phone,
        required: 'Phone number should be set correctly',
        allowBlank: false,
        allowedNumberTypes: [mongooseTypePhone.PhoneNumberType.MOBILE, mongooseTypePhone.PhoneNumberType.FIXED_LINE_OR_MOBILE],
        phoneNumberFormat: mongooseTypePhone.PhoneNumberFormat.INTERNATIONAL, // can be omitted to keep raw input
        defaultRegion: 'RU',
        parseOnGet: false
    }
});
```

## contribution
This project needs your contribution! :-)

## TODO
1) Add tests for all options (only tests for `required` and `allowBlank` are written now);
2) How can we avoid repeating of validation in `cast()` and `checkRequired()`?
3) Is it better to use custom class instead of prototype'ing String-type?
4) Improve examples in README.md?
5) Refactoring.  