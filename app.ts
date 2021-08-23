
import { App , ExpressReceiver,GenericMessageEvent} from '@slack/bolt'
import constants                from './constants'
import StoreObj                 from './storage.json'
//import db                       from './db.json'
import fs                       from 'fs'
import NodeCache                from 'node-cache' 
import  uuid                    from 'uuid';
import dialogflow from '@google-cloud/dialogflow';

const receiver = new ExpressReceiver({ signingSecret: constants.signingSecret,
  clientId: constants.clientId,
  clientSecret: constants.clientSecret,
  stateSecret: constants.stateSecret})

  receiver.router.get('/secret-page', (req, res) => {
  // You're working with an express req and res now.
  res.send('yay!');
});

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
        // Make whatever changes you want to the parsed data
        return await fs.writeFileSync('./storage.json', JSON.stringify(StoreObj));
        //StoreObj[installation.enterprise.id] = installation;
        //return StoreObj;
      }
      if (installation.team !== undefined) {
        // single team app installation
        StoreObj[installation.team.id] = installation;
        // Make whatever changes you want to the parsed data
        return await fs.writeFileSync('./storage.json', JSON.stringify(StoreObj));
        // StoreObj[installation.team.id] = installation;
        // return StoreObj;
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
        // Make whatever changes you want to the parsed data
        return await fs.writeFileSync('./storage.json', JSON.stringify(StoreObj));
        // delete StoreObj[installQuery.enterpriseId];
        // return StoreObj;
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        delete StoreObj[installQuery.teamId];
        // Make whatever changes you want to the parsed data
        return await fs.writeFileSync('./storage.json', JSON.stringify(StoreObj));
        // delete StoreObj[installQuery.teamId];
        // return StoreObj;
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
  const resArr = [];
  const sessionId = uuid.v4();
  const keyFilename = './chatbot-agent-uygg-1eab950a5770.json'

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({ keyFilename });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  let dialogflowRes ;
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
  if (!result.fulfillmentText) {
    console.log(`  Intent: ${result.intent.displayName}`);
    // if(result.intent.displayName!=='Default Welcome Intent'){
    try{
    const handler = require(`./intentHandlers/${result.intent.displayName}.ts`);
    const dataRes = await handler(result.fulfillmentText);
    resArr.push(result.fulfillmentText);
    resArr.push(JSON.stringify(dataRes));
    dialogflowRes = resArr[1]
    }
    catch(err){
      console.log(err);
    }
  } else {
    console.log(`  No intent matched.`);
    return result.fulfillmentText;
  }
console.log('______________'+dialogflowRes)
  return dialogflowRes;
}
app.message(/.*/, async ({ message,body, client}) => {
  if (message.channel_type === 'im') {
    let data = await connectDialogflow('chatbot-agent-uygg', (message as GenericMessageEvent).text);
    if(data.indexOf('mrkdwn')==35){
    await client.chat.postMessage({ channel: message.channel, text: data,blocks:data});
    }
    else{
    await client.chat.postMessage({ channel: message.channel, text: data});
    }
  }
});


(async () => {
  // Start the app
  await app.start(constants.port);
  await receiver.start(3001);

  console.log('⚡️ Bolt app is running! on 3000');
})();









