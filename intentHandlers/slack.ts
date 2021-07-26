module.exports = { 

    getText :  (param) => {

        const Textpayload = {
            type: 'section',
            text: 
            {
              type: 'mrkdwn',
              text: param
            },
           
          }
   
       console.log(Textpayload);
        return Textpayload
    },

    getLink :  (paramone,textUrl) => {
      const linkPayload   = {    
        type: 'section',
        text: 
        {
          type: 'mrkdwn',
          text: `<${textUrl}|${paramone}>`
        }
      
      }
        return linkPayload;
}
}