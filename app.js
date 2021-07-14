const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = 'e499e7e39002492ca430ddee3a964844';
const slackToken = 'xoxb-2254841740720-2268823171493-KNmhUXuq4RAxYEsjJrYU59AK';
const port = 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on('app_mention', (event) => {
  console.log(`Got message from user ${event.user}: ${event.text}`);
  (async () => {
    try {
      await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
    } catch (error) {
      console.log(error.data)
    }
  })();
});

slackEvents.on('im_created', (event) => {
    console.log(`Got message from user ${event.user}: ${event.text}`);
    (async () => {
      try {
        await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
      } catch (error) {
        console.log(error.data)
      }
    })();
  });

slackEvents.on('error', console.error);

slackEvents.start(port).then(() => {
  console.log(`Server started on port ${port}`)
});