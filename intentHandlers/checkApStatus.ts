const slackFun = require('./slack.ts');
module.exports = async function handler (queryInput) {
 const resData = `Here is a summary of details of ap as follows:
 Name: ruckusAP 
 Type: ap`
const blockData =  [
    slackFun.getText(resData),{
    "type": "divider"
  },
  slackFun.getLink('Go to Ap Report','https://www.google.com')
]
return blockData;
  }
