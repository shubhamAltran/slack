const { App } = require('@slack/bolt');
let StoreObj = {};

const app = new App({
  signingSecret: '',
  clientId: '',
  clientSecret: '',
  stateSecret: '',
  scopes: ['app_mentions:read', 'calls:read', 'calls:write', 'channels:history', 'channels:read', 'chat:write', 'groups:history', 'im:history', 'im:read', 'im:write', 'incoming-webhook', 'mpim:history', 'team:read'],

  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        // support for org wide app installation
        StoreObj[installation.enterprise.id] = installation;
        // console.log(StoreObj);
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

app.event('message', async ({ event, client }) => {

  if (event.channel_type === 'im') {
    console.log('inside im');

    await client.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` });
  }
});
app.event('app_mention', async ({ event, client }) => {
  console.log(event.channel)
  await client.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` });
});

app.event('error', console.error);

(async () => {
  // Start the app
  await app.start(process.env.PORT || 5000);

  console.log('⚡️ Bolt app is running! on 5000');
})();