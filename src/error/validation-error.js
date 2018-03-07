/**
 * Uses ajv-error format to create a validation error
 * that can be used as a regular error but with considerable more 
 * data about what when wrong with the input. 
 * 
 * @extends Error
 */
class ValidationError extends Error {

  constructor(object) {
    super(object.message || 'a validation error occurred'); 
    this._details = object.params.errors; 
    this._keyword = object.keyword || null; 
  }

  details() {
    return this._details; 
  }

  keyword() {
    return this._keyword; 
  }

  first() {
    return (this._details.length) ? this._details[0] : undefined; 
  }
}

module.exports = ValidationError; 