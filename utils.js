const nodemailer = require("nodemailer");
const crypto = require('crypto');
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function genResetToken(min, max) {
    return crypto.randomBytes(Math.random() * (max - min) + min).toString('hex');
}

async function sendMail(senderEmail, receiverEmail, password, service, port, token) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service,
        port,
        secure: (port === 465) ? true : false, // true for 465, false for other ports
        auth: {
            user: senderEmail, // generated ethereal user
            pass: password // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: senderEmail, // sender address
        to: receiverEmail, // list of receivers
        subject: "Reset Password", // Subject line
        text: `Here is your reset token: ${token}`, // plain text body
    });
}

module.exports = { validateEmail, sendMail, genResetToken };