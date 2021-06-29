const Dynamo = require('../common/Dynamo');
const Responses = require('../common/API_Responses');

async function handler(event,context){
  const action = JSON.parse(event.body).action;
  let result = {};
  console.log('action: ', action);
  switch (action) {
    case "subscribeChannel":
      result = await subscribeChannel(event, context);
      break;
    case "unsubscribeChannel":
      result = await unsubscribeChannel(event, context);
      break;
    default:
      break;
  }
  return (result.error) ? Responses._400(result) : Responses._200(result)
}

async function subscribeChannel(event, context) {
  const channelId = JSON.parse(event.body).channelId;
  console.log(Dynamo.chatSchema.Table);
  console.log({
    [Dynamo.chatSchema.Channel.Connections.Key]:`${Dynamo.chatSchema.Channel.Prefix}${channelId}`,
    [Dynamo.chatSchema.Channel.Connections.Range]:`${Dynamo.chatSchema.Connection.Prefix}${Dynamo.parseEntityId(event)}`
  });
  try {
    await Dynamo.write({
      [Dynamo.chatSchema.Channel.Connections.Key]:`${Dynamo.chatSchema.Channel.Prefix}${channelId}`,
      [Dynamo.chatSchema.Channel.Connections.Range]:`${Dynamo.chatSchema.Connection.Prefix}${Dynamo.parseEntityId(event)}`
    }, Dynamo.chatSchema.Table);
    return {message: 'User successfully subscribed!'};
  } catch (error) {
    console.log(error);
    return {error: 'Couldnt subscribe user'}; 
  }
}

async function unsubscribeChannel(event, context){
  const channelId = JSON.parse(event.body).channelId;
  console.log('channelID: ', channelId);
  console.log('Params for delete: ',{
    [Dynamo.chatSchema.Channel.Connections.Key]:`${Dynamo.chatSchema.Channel.Prefix}${channelId}`,
    [Dynamo.chatSchema.Channel.Connections.Range]:`${Dynamo.chatSchema.Connection.Prefix}${
      Dynamo.parseEntityId(event)
    }`
  });
  try {
    const item = await Dynamo.customDelete({
      [Dynamo.chatSchema.Channel.Connections.Key]:`${Dynamo.chatSchema.Channel.Prefix}${channelId}`,
      [Dynamo.chatSchema.Channel.Connections.Range]:`${Dynamo.chatSchema.Connection.Prefix}${
        Dynamo.parseEntityId(event)
      }`
    },Dynamo.chatSchema.Table);
    return {message: 'Subscription to a channel succesfully cancelled'}  
  } catch (error) {
    console.log(error);
    return { error: "Couldnt unsubscribe from the channel" };
  }
}

module.exports = {
  handler,
  subscribeChannel,
  unsubscribeChannel
}
