const { App } = require('@slack/bolt');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const constants = require('./constants');
let StoreObj = {};

const app = new App({
  signingSecret: constants.signingSecret,
  clientId: constants.clientId,
  clientSecret: constants.clientSecret,
  stateSecret: constants.stateSecret,
  scopes: ['app_mentions:read', 'calls:read', 'calls:write', 'channels:history', 'channels:read', 'chat:write', 'groups:history', 'im:history', 'im:read', 'im:write', 'incoming-webhook', 'mpim:history', 'mpim:read', 'team:read'],

  
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        // support for org wide app installation
        StoreObj[installation.enterprise.id] = installation;
        return StoreObj;
      }
      if (installation.team !== undefined) {
        // single team app installation
        StoreObj[installation.team.id] = installation;
        return StoreObj;
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      // change the line below so it fetches from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation lookup
        return StoreObj[installQuery.enterpriseId];
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup

        return StoreObj[installQuery.teamId];
      }

      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {

      // change the line below so it deletes from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation deletion
        delete StoreObj[installQuery.enterpriseId];
        return StoreObj;
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        delete StoreObj[installQuery.teamId];
        return StoreObj;
      }
      throw new Error('Failed to delete installation');
    },
  },
});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function connectDialogflow(projectId, userText) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();
  const keyFilename = './chatbot-agent-uygg-1eab950a5770.json'

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({ keyFilename });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: userText,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  //console.log(JSON.stringify(responses))
  console.log('Detected intent');
  const result = responses[0].queryResult;

  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  return result.fulfillmentText
}

app.event('message', async ({ event, client }) => {
  if (event.channel_type === 'im') {
    console.log(`Got message from user ${event.user}: ${event.text}`);
    let data = await connectDialogflow('chatbot-agent-uygg', event.text);
    console.log("Run sampleeeeeeeeeeeee end")
    await client.chat.postMessage({ channel: event.channel, text: data });
  }
});

app.event('app_mention', async ({ event, client }) => {
  console.log(event.channel)
  await client.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` });
});

app.event('error', console.error);

(async () => {
  // Start the app
  await app.start(constants.port);

  console.log('⚡️ Bolt app is running! on 3000');
})();