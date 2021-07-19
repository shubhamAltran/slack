// const { WebClient } = require('@slack/web-api');
// const { createEventAdapter } = require('@slack/events-api');

// const slackSigningSecret = '';
// const slackToken = '';
// const port = 3000;

// const slackEvents = createEventAdapter(slackSigningSecret);
// const slackClient = new WebClient(slackToken);

// const conversationId = '';

// // (async () => {

// //   // Post a message to the channel, and await the result.
// //   // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
// //   const result = await slackClient.chat.postMessage({
// //     text: 'Hello world!',
// //     channel: conversationId,
// //   });

// //   // The result contains an identifier for the message, `ts`.
// //   console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
// // })();

// // async function noBotMessages({ message, next }) {
// //   if (!message.subtype || message.subtype !== 'bot_message') {
// //     await next();
// //   }
// // }
// slackEvents.on('app_mention', (event) => {
//   console.log("I cam here")
//   console.log(`Got message from user ${event.user}: ${event.text}`);
//   (async () => {
//     try {
//       await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
//     } catch (error) {
//       console.log(error.data)
//     }
//   })();
// });

// slackEvents.on('message', (event) => {
//     (async () => {
//       try {
//         await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
//       } catch (error) {
//         console.log(error.data)
//       }
//     })();
//   });

// slackEvents.on('error', console.error);

// slackEvents.start(port).then(() => {
//   console.log(`Server started on port ${port}`)
// });

const { App } = require('@slack/bolt');

const app = new App({
  signingSecret: 'enter secret key',
  token: 'enter token',
});

/* Add functionality here */
app.event('message', async ({ event, client }) => {
  // Do some slack-specific stuff here
  //enter your channel id
  if(event.channel === ''){
  console.log(event.channel)
  await client.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` });
}
});
app.event('app_mention', async ({ event, client }) => {
  // Do some slack-specific stuff here
  console.log(event.channel)
  await client.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` });
});

app.event('error', console.error);

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running! on 3000');
})();