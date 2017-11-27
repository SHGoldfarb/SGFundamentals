/* eslint no-param-reassign:off */

const request = require('superagent');
const _ = require('lodash');


// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};


const clientGenerator = function clientGenerator(appId, key) {
  const client = {};
  client.writeHosts = [
    `https://${appId}.algolia.net`,
    `https://${appId}-1.algolia.net`,
    `https://${appId}-2.algolia.net`,
    `https://${appId}-3.algolia.net`,
  ];
  client.readHosts = [
    `https://${appId}-dsn.algolia.net`,
    `https://${appId}-1-dsn.algolia.net`,
    `https://${appId}-2-dsn.algolia.net`,
    `https://${appId}-3-dsn.algolia.net`,
  ];
  shuffle(client.writeHosts);
  shuffle(client.readHosts);

  client.initIndex = function initIndex(indexName) {
    const index = {};

    index.addObject = async function addObject(object) {
      let response;
      const fname = 'addObject';
      console.log(`REQUESTING ${fname}`);
      if (object.objectID) {
        response = await request
          .post(`${client.writeHosts[0]}/1/indexes/${indexName}/${object.objectID}/partial`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`)
          .set('Content-Type', 'application/json; charset=UTF-8')
          .send(object);
      } else {
        response = await request
          .post(`${client.writeHosts[0]}/1/indexes/${indexName}`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`)
          .set('Content-Type', 'application/json; charset=UTF-8')
          .send(object);
      }
      console.log(`RESPONSE ${fname} ${response.text}`);
    };

    index.addObjects = async function addObjects(objects) {
      const fname = 'addObjects';
      console.log(`REQUESTING ${fname}`);
      let response;
      if (objects[0].objectID) {
        for (const i in objects) {
          const aux = objects[i];
          objects[i] = {
            action: 'partialUpdateObject',
            objectID: aux.objectID,
            body: aux,
          };
        }
        response = await request
          .post(`${client.writeHosts[0]}/1/indexes/${indexName}/batch`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`)
          .set('Content-Type', 'application/json; charset=UTF-8')
          .send({ requests: objects });
      } else {
        for (const i in objects) {
          const aux = objects[i];
          objects[i] = {
            action: 'addObject',
            body: aux,
          };
        }
        response = await request
          .post(`${client.writeHosts[0]}/1/indexes/${indexName}/batch`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`)
          .set('Content-Type', 'application/json; charset=UTF-8')
          .send({ requests: objects });
      }
      console.log(`RESPONSE ${fname} ${response.text}`);
    };

    index.deleteObject = async function deleteObject(objectID) {
      const fname = 'deleteObject';
      console.log(`REQUESTING ${fname}`);
      const response = await request.delete(`${client.writeHosts[0]}/1/indexes/${indexName}/${objectID}`)
        .set('X-Algolia-Application-Id', `${appId}`)
        .set('X-Algolia-API-Key', `${key}`);
      console.log(`RESPONSE ${fname} ${response.text}`);
    };

    index.clearIndex = async function clearIndex(callbackFoo) {
      const fname = 'clearIndex';
      console.log(`REQUESTING ${fname}`);
      const response = await request.post(`${client.writeHosts[0]}/1/indexes/${indexName}/clear`)
        .set('X-Algolia-Application-Id', `${appId}`)
        .set('X-Algolia-API-Key', `${key}`)
        .set('Content-Type', 'application/json; charset=UTF-8');
      console.log(`RESPONSE ${fname} ${response.text}`);
      callbackFoo(null, response);
    };

    index.waitTask = function waitTask(taskID, callbackFoo) {
      callbackFoo(null);
    };

    index.setSettings = async function setSettings(settings) {
      const fname = 'setSettings';
      console.log(`REQUESTING ${fname}`);
      const response = await request.put(`${client.writeHosts[0]}/1/indexes/${indexName}/settings`)
        .set('X-Algolia-Application-Id', `${appId}`)
        .set('X-Algolia-API-Key', `${key}`)
        .set('Content-Type', 'application/json; charset=UTF-8')
        .send(settings);
      console.log(`RESPONSE ${fname} ${response.text}`);
    };

    return index;
  };
  return client;
};


module.exports = clientGenerator;
