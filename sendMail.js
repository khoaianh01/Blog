const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;
const redirect_Uri = process.env.REDIRECT_URL;
const emailAdmin = process.env.EMAIL_ADMIN;
const OAuth2client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirect_Uri
);
OAuth2client.setCredentials({ refresh_token: refresh_token });
//ab
module.exports.sendMail = async function (
  username,
  fromEmail,
  text,
  toEmail,
  contentHtml
) {
  var mainOptions = {
    from: `<${fromEmail}>`,
    to: toEmail,
    subject: "Test Nodemailer",
    text: text,
    html: contentHtml,
  };

  try {
    const accessToken = await OAuth2client.getAccessToken();

    var transporter = nodemailer.createTransport({
      // config mail server
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: emailAdmin,
        clientId,
        clientSecret: clientSecret,
        refreshToken: refresh_token,
        accessToken: accessToken,
      },
      // auth: {
      //     type:'OAuth2',
      //     user: 'lehaianh111103@gmail.com',
      //     clientId:'723153731149-1lmqjuj7m5qjdl9ppsvr20hb1aih54df.apps.googleusercontent.com',
      //     clientSecret:'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',
      //     refreshToken: '1//04nBoN_SDhzeGCgYIARAAGAQSNwF-L9Ir0qrWCA9avoquVPiLzTIQmCncYMaOP88E9Qnl7-r9wzBe0JDufWLi25lmZrcPr0zPqJU',
      //     accessToken: accessToken
      // }
    });

    let info = await transporter.sendMail(mainOptions);
  } catch (err) {
    return "fail";
  }
};
