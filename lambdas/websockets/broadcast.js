
const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const websocket = require('../common/websocketMessage');

exports.broadcastHandler = async (event) => {
  try {
    console.log('Event: ', event);
    // const results = event.Records.map(async record => {
    //   switch (record.dynamodb.Keys[Dynamo.chatSchema.Primary.Key].S.split("|")[0]) {
    //     case Dynamo.chatSchema.Connection.Entity:
    //       break;
    //     //events regarded to channels 
    //     case Dynamo.chatSchema.Channel.Entity:
    //       // figure out what to do based on full entity model
    //       // get secondary ENTITY| type by splitting on | and looking at first part
    //       switch (record.dynamodb.Keys[Dynamo.chatSchema.Primary.Range].S.split("|")[0]) {
    //         //if it's a CONNECTION
    //         case Dynamo.chatSchema.Connection.Entity:{
    //           let eventType = "sub";
    //           if(record.eventName === "REMOVE"){
    //             eventType = "unsub";
    //           } else if (record.eventName === "UPDATE"){
    //             //not possible so not handled yet
    //             break;
    //           }
              
    //           // Detecting connection events and
    //           // notifying all users if its a new one or a dropped one
    //           const channelId = Dynamo.parseEntityId(
    //             record.dynamodb.Keys[Dynamo.chatSchema.Primary.Key].S
    //           );

    //           //Fecthing all subscribed to the channel
    //           const subscribers = await Dynamo.fetchChannelSubscriptions(channelId);
    //           const results = subscribers.map( async subscriber => {
    //             const subscriberId = Dynamo.parseEntityId(
    //               subscriber[Dynamo.chatSchema.Channel.Connections.Range]
    //             );
    //             return websocket.send({connectionID: subscriberId, message:{
    //               event: `subscriber_${eventType}`,
    //               channelId,
    //               subscriberId: Dynamo.parseEntityId(
    //                 record.dynamodb.Keys[Dynamo.chatSchema.Primary.Range].S
    //               )
    //             }})
    //           });
    //           await Promise.all(results);
    //           break;
    //         }
    //         case Dynamo.chatSchema.Message.Entity: {
    //           if(record.eventName !== "INSERT"){
    //             return Responses._200();
    //           }
    //           break;
    //         }
    //         default:
    //           break;
    //       }
    //     break;
    //     default:
    //       break;
    //   }
    // });
    // await Promise.all(results);
    // return Responses._200({ message: "got a message" });
  } catch (error) {
    return Responses._400({ message: "could not be received!" });
  }
};
