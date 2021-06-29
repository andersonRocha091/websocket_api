//Api called whenever someone connects to our websocket
const sanitize = require('sanitize-html');
const Responses = require('../common/API_Responses');

const Dynamo = require('../common/Dynamo');
const websocket = require('../common/websocketMessage');


const tableName = process.env.TABLE_NAME;

exports.messageHandler = async event => {

  try {
    const body = JSON.parse(event.body);
    console.log('TYPE: ', typeof body);
    console.log('NAME: ',body.name);
    console.log('CONTENT: ',body.content);
    const messageId = `${Dynamo.chatSchema.Message.Prefix}${Date.now()}`;
    console.log('MESSAGEID: ',messageId);
    const name = body.name
      .replace(/[^a-z0-9\s-]/gi, "")
      .trim()
      .replace(/\+s/g, "-");
    
    const content = sanitize(body.content, {
      allowedTags: [
        "ul",
        "ol",
        "b",
        "i",
        "em",
        "strike",
        "pre",
        "strong",
        "li",
      ],
      allowedAttributes: {},
    });
    console.log('CONTENT: ',content);
    //saving message at database
    console.log("ITEMTOBEWRITTEN: ", {
      [Dynamo.chatSchema.Message.Primary
        .Key]: `${Dynamo.chatSchema.Channel.Prefix}${body.channelId}`,
      [Dynamo.chatSchema.Message.Primary.Range]: messageId,
      ConnectionId: `${event.requestContext.connectionId}`,
      Name: name,
      Content: content,
    });

    const item = await Dynamo.write(
      {
        [Dynamo.chatSchema.Message.Primary
          .Key]: `${Dynamo.chatSchema.Channel.Prefix}${body.channelId}`,
        [Dynamo.chatSchema.Message.Primary.Range]: messageId,
        ConnectionId: `${event.requestContext.connectionId}`,
        Name: name,
        Content: content,
      },
      tableName
    );

    const subscribers = await Dynamo.fetchChannelSubscriptions(body.channelId);
    const results = subscribers.map(async (subscriber) => {
      const subscriberId = Dynamo.parseEntityId(
        subscriber[Dynamo.chatSchema.Channel.Connections.Range]
      );
      console.log('SENDING MESSAGE TO: ', subscriberId);
      return websocket.send({
        domainName: "local",
        stage: "dev",
        connectionID: subscriberId,
        message: content,
      });
    });
    await Promise.all(results);
    return Responses._200({ message: "got a message" });  
  } catch (error) {
    return Responses._400({ message: "could not be received!" });
  }
  
}