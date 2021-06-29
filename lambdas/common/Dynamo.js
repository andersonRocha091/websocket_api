const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient({
    endpoint:process.env.DYNAMOHOST
});
const chatSchema = {
  Table: process.env.TABLE_CHAT,
  Primary: {
    Key: "pk",
    Range: "sk",
  },
  Connection: {
    Primary: {
      Key: "pk",
      Range: "sk",
    },
    Channels: {
      Index: "reverse",
      Key: "sk",
      Range: "pk",
    },
    Prefix: "CONNECTION|",
    Entity: "CONNECTION",
  },
  Channel: {
    Primary: {
      Key: "pk",
      Range: "sk",
    },
    Connections: {
      Key: "pk",
      Range: "sk",
    },
    Messages: {
      Key: "pk",
      Range: "sk",
    },
    Prefix: "CHANNEL|",
    Entity: "CHANNEL",
  },
  Message: {
    Primary: {
      Key: "pk",
      Range: "sk",
    },
    Prefix: "MESSAGE|",
    Entity: "MESSAGE",
  },
};

const channelRegex = new RegExp(`^${chatSchema.Channel.Entity}\|`);
const messageRegex = new RegExp(`^${chatSchema.Message.Entity}\|`);
const connectionRegex = new RegExp(`^${chatSchema.Connection.Entity}\|`);

const Dynamo = {
  chatSchema,
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data for ID of ${ID} from ${TableName}`
      );
    }
    console.log(data);

    return data.Item;
  },

  async write(data, TableName) {
    const params = {
      TableName,
      Item: data,
    };
    console.log("params: ", params);
    const res = await documentClient.put(params).promise();
    console.log("RESULT: ", res);
    if (!res) {
      throw Error(
        `There was an error inserting ID of ${data.ID} in table ${TableName}`
      );
    }

    return data;
  },

  async delete(ID, TableName) {
    console.log("DELETE: ", ID);
    const params = {
      TableName,
      Key: {
        pk: ID,
        sk: 'WS_CONFIG'
      },
    };

    return documentClient.delete(params).promise();
  },
  async customDelete(paramsObject, TableName) {
    const params = {
      TableName,
      Key: paramsObject,
    };

    return documentClient.delete(params).promise();
  },
  parseEntityId(target) {
    console.log("ENTITY ID A ", target);
    if (typeof target === "object") {
      // use from raw event, only needed for connectionId at the moment
      target = target.requestContext.connectionId;
    } else {
      // strip prefix if set so we always get raw id
      target = target
        .replace(channelRegex, "")
        .replace(messageRegex, "")
        .replace(connectionRegex, "");
    }

    return target.replace("|", ""); // why?!
  },
  async fetchConnectionSubscriptions(connection) {
    const connectionId = this.parseEntityId(connection);
    console.log("connectionId", connectionId);
    const results = await documentClient
      .query({
        TableName: chatSchema.Table,
        IndexName: chatSchema.Connection.Channels.Index,
        KeyConditionExpression: `${chatSchema.Connection.Channels.Key} = :connectionId and begins_with(${chatSchema.Connection.Channels.Range}, :channelEntity)`,
        ExpressionAttributeValues: {
          ":connectionId": `${chatSchema.Connection.Prefix}${connectionId}`,
          ":channelEntity": chatSchema.Channel.Prefix,
        },
      })
      .promise();
    return results.Items;
  },
  async fetchChannelSubscriptions(channel){
    const channelId = this.parseEntityId(channel);
    const results = await documentClient.query({
      TableName: chatSchema.Table,
      KeyConditionExpression: `${chatSchema.Channel.Connections.Key} = :channelId and begins_with(${
        chatSchema.Channel.Connections.Range
      }, :connectionEntity)`,
      ExpressionAttributeValues: {
        ":channelId": `${chatSchema.Channel.Prefix}${channelId}`,
        ":connectionEntity": chatSchema.Connection.Prefix
      }
    }).promise()

    return results.Items;
  },
};
module.exports = Dynamo;
