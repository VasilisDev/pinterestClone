'use scrict'
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePinInput(data) {
    let errors = {};
    data.description = !isEmpty(data.description) ? data.description : '';
    data.url = !isEmpty(data.url) ? data.url : '';

    if(Validator.isEmpty(data.url)) {
        errors.url = 'Url is required';
    }

    if(Validator.isEmpty(data.description)) {
        errors.description = 'Description is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
