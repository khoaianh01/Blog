const nodemailer =  require('nodemailer');
const {google} = require('googleapis');


const clientID = process.env.CLIENT_ID;
const clientSecret= process.env.CLIENT_SECRET;
const refresh_token= process.env.REFRESH_TOKEN;
const redirect_Uri = process.env.REDIRECT_URI;
const emailAdmin = process.env.EMAIL_ADMIN;
const OAuth2client = new google.auth.OAuth2(clientID,clientSecret,redirect_Uri);
OAuth2client.setCredentials({ refresh_token: refresh_token});
async function sendMail(username,fromEmail,text,toEmail,contentHtml){
 
    var mainOptions = { 
        from: username,
        to: toEmail,
        subject: 'Test Nodemailer',
       
        html: contentHtml
    }
        try
        {  
            const accessToken = await OAuth2client.getAccessToken();
            var transporter =  nodemailer.createTransport({ // config mail server
                service: 'gmail',
                auth: {
                    type:'OAuth2',
                    user: emailAdmin,
                    clientId,
                    clientSecret: clientSecret,
                    refreshToken: refresh_token,
                    accessToken: accessToken
                }
            });
          await  transporter.sendMail(mainOptions, function(err, info){
        if (err) 
            return 'fail';
    });
        }
        catch(err){
           return 'fail';
        }
   
}
module.exports.sendMail = sendMail;