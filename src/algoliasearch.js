/* eslint no-param-reassign:off, no-await-in-loop:off */

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

  const _send = async function _send(times, method, url, object) {
    let response;
    switch (method) {
      case 'get':
        response = await request
          .get(`${client.readHosts[times]}${url}`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`)
          .set('Content-Type', 'application/json; charset=UTF-8');
        break;
      case 'post':
        response = await request
          .post(`${client.writeHosts[times]}${url}`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`)
          .set('Content-Type', 'application/json; charset=UTF-8')
          .send(object);
        break;
      case 'put':
        response = await request.put(`${client.writeHosts[times]}${url}`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`)
          .set('Content-Type', 'application/json; charset=UTF-8')
          .send(object);
        break;
      case 'delete':
        response = await request.delete(`${client.writeHosts[times]}${url}`)
          .set('X-Algolia-Application-Id', `${appId}`)
          .set('X-Algolia-API-Key', `${key}`);
        break;
      default:
        throw new Error('Unsupported method');
    }
    return response;
  };

  const send = async function send(method, url, object, name) {
    console.log(`REQUESTING ${name}`);
    let response;
    let times = 0;
    while (times < 4) {
      try {
        response = await _send(times, method, url, object);
      } catch (err) {
        response = { text: 'ERROR' };
      }
      if (!response.text || response.text === 'ERROR') {
        times += 1;
      } else {
        times = 4;
      }
    }
    console.log(`RESPONSE ${name} ${response.text}`);
    return response;
  };

  client.initIndex = function initIndex(indexName) {
    const index = {};

    index.addObject = async function addObject(object) {
      let response;
      const fname = 'addObject';
      if (object.objectID) {
        response = await send('post', `/1/indexes/${indexName}/${object.objectID}/partial`, object, fname);
      } else {
        response = await send('post', `/1/indexes/${indexName}`, object, fname);
      }
    };

    index.addObjects = async function addObjects(objects) {
      const fname = 'addObjects';
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
        response = await send('post', `/1/indexes/${indexName}/batch`, { requests: objects }, fname);
      } else {
        for (const i in objects) {
          const aux = objects[i];
          objects[i] = {
            action: 'addObject',
            body: aux,
          };
        }
        response = await send('post', `/1/indexes/${indexName}/batch`, { requests: objects }, fname);
      }
    };

    index.deleteObject = async function deleteObject(objectID) {
      const fname = 'deleteObject';
      const response = await send('delete', `/1/indexes/${indexName}/${objectID}`, null, fname);
    };

    index.clearIndex = async function clearIndex(callbackFoo) {
      const fname = 'clearIndex';
      const response = await send('post', `/1/indexes/${indexName}/clear`, null, fname);
      callbackFoo(null, response);
    };

    index.waitTask = function waitTask(taskID, callbackFoo) {
      callbackFoo(null);
    };

    index.setSettings = async function setSettings(settings) {
      const fname = 'setSettings';
      const response = await send('put', `/1/indexes/${indexName}/settings`, settings, fname);
    };

    return index;
  };
  return client;
};


module.exports = clientGenerator;
