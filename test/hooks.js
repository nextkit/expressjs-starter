const dotenv = require('dotenv');
dotenv.config();

const { AfterAll, BeforeAll } = require('cucumber');
const axios = require('axios');

// Asynchronous Callback
BeforeAll(done => {
  done();
});

// Asynchronous Promise
AfterAll(done => {
  done();
});
