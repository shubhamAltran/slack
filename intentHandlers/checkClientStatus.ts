
console.log('inside file');
const slack = require('./slack.ts');
module.exports = async function handler (queryInput) {
  console.log('inside function');
const resData = `Here is a summary of client details as follows:
Name: Iphone
Type: Client`
  console.log(queryInput)
  // const blockData1 =  [
  //   {
  //     "type": "section",
  //     "text": {
  //       "type": "mrkdwn",
  //       "text": "*Go to Client Report?* <https://www.google.com|Client Report>"
  //     }
  //   },
             
  // ]

const blockData =  [
  slack.getText(resData),{
    "type": "divider"
  },
  slack.getLink('Go to Client Report','https://www.google.com')
]
return blockData;
  }
