//Api called whenever someone connects to our websocket

const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const ChannelManager = require('../websockets/channelManager')

//table name will be get from environment variables from serverless
const tableName = process.env.TABLE_NAME;

exports.handler = async (event,context) => {
  //on new connection logs the connection and returns a 
  // message of succesfull connection
  console.log('event: ',event)
  const { connectionId: connectionID } = event.requestContext;
  const subscriptions = await Dynamo.fetchConnectionSubscriptions(event);
  console.log('SUBSCRIPTIONS: ', subscriptions);
  const result =  await Dynamo.customDelete({pk:connectionID,sk: 'WS_CONFIG'},tableName);
  console.log('DELETE RESULT: ', result);
  const unsubscribes = subscriptions.map(async subscription => {
    console.log('subscription: ', subscription);
    ChannelManager.unsubscribeChannel(
      {
        ...event,
        body: JSON.stringify({
          action: "unsubscribe",
          channelId: Dynamo.parseEntityId(subscription[Dynamo.chatSchema.Channel.Primary.Key]),
        }),
      },
      context
    );
  });
  await Promise.all(unsubscribes);
  return Responses._200({message: 'disconnected'});
} 