const nodemailer = require('nodemailer');

//Send Email
const SendEmail = async (emailData) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
        });

        const mailOptions = {
            from: 'Team Project <coderrafat@gmail.com>',
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html
        };

        return await transporter.sendMail(mailOptions)

    } catch (error) {
        console.log(error)
    }
};

module.exports = SendEmail;

