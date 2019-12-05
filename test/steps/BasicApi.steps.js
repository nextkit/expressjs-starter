const dotenv = require('dotenv');
dotenv.config();
const { Given, When, Then } = require('cucumber');
const should = require('should');
const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;

const AxiosOptions = require('../util/AxiosOption');

let axiosOption;
let token;
let objects = {};

Given('{string} {string} is logged in with the password {string}', async (key, value, password) => {
  axiosOption = new AxiosOptions('/api/users/login', 'POST');
  axiosOption.setBody({ [key]: value, password });
  const response = await axiosOption.send();
  response.status.should.be.equal(200);
  response.data.should.have.property('token');
  token = `Bearer ${response.data.token}`;
});

When('requesting {string} with the method {string}', (url, method) => {
  axiosOption = new AxiosOptions(url, method);
});

Then('request body', docString => {
  const json = JSON.parse(docString);
  for (const key of Object.keys(json)) {
    if (json[key].substring(0, 1) === '[' && json[key].substring(json[key].length - 1, json[key].length) === ']') {
      json[key] = objects[json[key].substring(1, json[key].length - 1)];
    }
  }
  axiosOption.setBody(json);
});

Then('response has status {string}', async status => {
  if (token) {
    axiosOption.setHeaders('Authorization', token);
    token = undefined;
  }
  const response = await axiosOption.send();
  objects = {};

  status = Number(status);
  response.status.should.equal(status);
});

Then('response body has property {string}', property => {
  axiosOption.response.data.should.have.property(property);
});

Then('response body property {string} is of type {string}', (property, type) => {
  switch (type.toLowerCase()) {
    case 'array':
      axiosOption.response.data.should.have.property(property).Array();
      break;
    case 'object':
      axiosOption.response.data.should.have.property(property).Object();
      break;
    case 'string':
      axiosOption.response.data.should.have.property(property).String();
      break;
    case 'number':
      axiosOption.response.data.should.have.property(property).Number();
      break;
    case 'boolean':
      axiosOption.response.data.should.have.property(property).Boolean();
      break;
  }
});

Then('response body has property {string} equals {string}', (property, value) => {
  axiosOption.response.data.should.have.property(property).equals(value);
});

Then('response body property {string} contains key {string} which is equal to {string}', (property, key, value) => {
  axiosOption.response.data.should.have.property(property).Array();
  const arrayOfKeys = [];

  for (const obj of axiosOption.response.data[property]) {
    arrayOfKeys.push(obj[key]);
  }
  expect(arrayOfKeys).to.include.members([value]);
});

Then('response body property {string} has the length of {string}', (property, length) => {
  axiosOption.response.data.should.have.property(property).has.length(Number(length));
});

Then('user selects random document from collection {string}', async collectionName => {
  const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
  const client = new MongoClient(uri, { useNewUrlParser: true });

  await client.connect();
  const collection = client.db(process.env.DB_NAME).collection(collectionName);
  const result = await collection.countDocuments({}, {});
  const random = Math.floor(Math.random() * result);
  const doc = await collection.findOne({}, { limit: 1, skip: random });
  if (doc) {
    objects = { ...objects, [collectionName]: doc._id.toString() };
  }

  client.close();
});
