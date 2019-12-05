const axios = require('axios');

class AxiosOptions {
  constructor(url, method) {
    this.url = url;
    this.method = method;
  }

  setBody(data) {
    this.data = data;
  }

  setHeaders(key, value) {
    if (this.headers == null) {
      this.headers = {};
    }
    this.headers = { [key]: value, ...this.headers };
  }

  send() {
    return new Promise(resolve => {
      axios({
        url: `http://localhost:${process.env.PORT}${this.url}`,
        method: this.method,
        headers: this.headers,
        data: this.data,
      })
        .then(response => (this.res = response))
        .catch(err => (this.res = err.response))
        .finally(() => resolve(this.res));
    });
  }

  get response() {
    return this.res;
  }
}

module.exports = AxiosOptions;
