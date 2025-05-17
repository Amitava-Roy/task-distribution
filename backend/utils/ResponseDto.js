class ResponseDto {
  constructor(message, responseCode, result) {
    this.message = message;
    this.responseCode = responseCode;
    this.result = result;
  }
}

module.exports = ResponseDto;
