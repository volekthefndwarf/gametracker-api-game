class APIError extends Error {
  constructor(object) {
    super(object.message); 
    this.code = object.code;     
  }

  code() {
    return this.code; 
  }
}