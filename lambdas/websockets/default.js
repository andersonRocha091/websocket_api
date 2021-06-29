//Api called whenever someone connects to our websocket

const Responses = require('../common/API_Responses');

exports.handler = async event => {
  //on new connection logs the connection and returns a 
  // message of succesfull connection
  console.log('event: ',event)

  return Responses._200({message: 'default'});
} 