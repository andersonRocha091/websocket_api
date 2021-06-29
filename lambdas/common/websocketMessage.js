const AWS = require('aws-sdk');

//create connection to send message back

const create = (domainName, stage) => {
  //url for connection
  let endpoint = `${domainName}/${stage}`;
  //only for local test purpose
  endpoint = 'http://0.0.0.0:3001';

  console.log('endpoint: ',endpoint);
  return new AWS.ApiGatewayManagementApi({
    apiVersion: '2021-05-25',
    endpoint
  })
}

const send = async ({domainName, stage, connectionID, message})=>{
  const webSocket = create(domainName,stage);
  console.log('websocket: ', webSocket)
  const postParams = {
    Data: message,
    ConnectionId: connectionID
  };
  console.log('postParams: ',postParams)
  try {
    const result = await webSocket.postToConnection(postParams).promise();
    console.log('result: ',result);
    return result;  
  } catch (error) {
    console.log('error: ',error);
    return error;
  }
  // const result = await webSocket.postToConnection(postParams).promise();
  // console.log('result: ',result);
  // return result;
}

module.exports = {
  send,
}