// import { StatusCodes } from 'http-status-codes';
class ValidationError extends Error {
  constructor(message, details = 400) {
    super(message);
    this.name = this.constructor.name;
    this.details = details; // This will hold the status code (default 400)
  }
}

export default ValidationError;
