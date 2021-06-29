const Responses = require('../common/API_Responses.js');
exports.handler = async event => {
  return Responses._200({message: 'got a message awesome'});
}