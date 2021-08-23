
console.log('inside file');
const slack = require('./slack.ts');
module.exports = async function handler (queryInput) {
  console.log('inside function');
const resData = `There are 21 clients similar to iphone.
Showing the last active one

Here is a summary of client 0A:96:36:19:7D:

Client IP: 10.0.0.107
Hostname: VijayKaksiPhone
Username: 0aab9636197d
MAC Address: 0A:96:36:19:7D
Last AP Name: Kalyan_Home_R850
Last AP Mac: 70:CA:97:2C:4D:70
Last Status: Disconnected
OS: iOS Phone

Average Rate: 8.5Kbps
Total Traffic: 85.9 MB
Average Sessions Length: 10m 24s
Applications: 0
APs Connected: 1
Sessions: 1

Average SNR: 42 dB
Max SNR: 43 dB
Min SNR: 42 dB

Average RSS: -53 dBm
Max RSS: -53 dBm
Min RSS: -54 dBm`
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
