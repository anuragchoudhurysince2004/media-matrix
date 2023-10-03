const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../app");

const sendEmail = async (option) => {
    // 1) Create tansporter
    const transporter = nodemailer.createTransport({
        // service: "gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // 2)define email options
    const mailOptions = {
        from: "PIB Media Analyzer <ai@medianalyzer.com>",
        to: option.email,
        subject: option.subject,
        text: option.message,
    };
    // 3)actually send email
    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
